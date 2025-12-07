from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import bcrypt
import os
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta
from collections import defaultdict
from cryptography.fernet import Fernet
import traceback

# NEW: Import Groq
from groq import Groq


# Load environment variables
load_dotenv()

# Load Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY is missing. Add it to your .env file.")

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# Encryption Key
ENCRYPTION_KEY = os.getenv("FERNET_KEY")

if not ENCRYPTION_KEY:
    raise ValueError("❌ FERNET_KEY is missing. Add it in your .env")

# Fernet expects BYTES
fernet = Fernet(ENCRYPTION_KEY.encode())

# (NO GEMINI ANYMORE)
# Deleted:
# genai.configure(api_key=GOOGLE_API_KEY)
# model = genai.GenerativeModel("gemini-2.0-flash-lite")

# Flask setup
app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# Collections (global)
users_collection = mongo.db.users
journals_collection = mongo.db.journals
memories_collection = mongo.db.memories
summaries_collection = mongo.db.summaries
calm_quest_collection = mongo.db.calm_quest


def encrypt_text(plain_text):
    """Encrypt journal text before saving. Returns string or None."""
    if plain_text is None:
        return None
    if not isinstance(plain_text, str):
        plain_text = str(plain_text)
    token = fernet.encrypt(plain_text.encode())
    return token.decode()

def decrypt_text_safe(encrypted_text):
    """Try to decrypt; if it fails, return empty string (or original)."""
    if not encrypted_text:
        return ""
    # If it's already plaintext (very unlikely) - you can try a heuristic:
    # Fernet tokens usually start with "gAAAA" — but we still try decrypt
    try:
        return fernet.decrypt(encrypted_text.encode()).decode()
    except Exception as e:
        # Decryption failed — log and return fallback
        print("⚠️ Decryption failed:", e)
        # fallback: return empty string so UI doesn't crash, or return original
        return ""


@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        users_collection = mongo.db.users  # make sure "users" is your collection name

        # Check if user already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'message': 'User already exists'}), 409

        # Hash the password
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        # Insert new user
        users_collection.insert_one({
            'username': data['username'],
            'email': data['email'],
            'password': hashed_pw
        })

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e), 'message': 'An error occurred'}), 500

@app.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json(force=True)  # force=True ensures parsing

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        users_collection = mongo.db.users
        user = users_collection.find_one({'email': email})

        if user:
            print("User found:", user.get('username'))

        # Ensure password is stored as bytes
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'message': 'Login successful', 'username': user['username']}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401

    except Exception as e:
        import traceback
        traceback.print_exc()  # full stack trace in terminal
        return jsonify({'error': str(e), 'message': 'An error occurred'}), 500


# ------------------------------------------------------
# SAVE JOURNAL ENTRY (with Gemini AI)
# ------------------------------------------------------
@app.route('/save-journal', methods=['POST'])
def save_journal():
    import traceback

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        username = (data.get('username') or "").strip()
        entry_text = (data.get('entry') or "").strip()
        date = data.get('date') or datetime.utcnow().strftime('%Y-%m-%d')
        micro_checkin = data.get("micro")  # 🔥 Capture micro-checkin from frontend
        print("🔥 Micro checkin received:", micro_checkin)



        if not username:
            return jsonify({'error': 'Missing username'}), 400
        if not entry_text:
            return jsonify({'error': 'Missing journal entry'}), 400

        journals_collection = mongo.db.journals
        sessions_col = mongo.db.validation_sessions
        timestamp_now = datetime.utcnow()

        # Delete any old session for that date
        sessions_col.delete_one({"username": username, "date": date})

        # -----------------------------
        # 1️⃣ SAVE JOURNAL ENTRY FIRST
        # -----------------------------
        new_entry = {
            "date": date,
            "text": encrypt_text(entry_text),
            "micro_checkin": micro_checkin,   # 🔥 Save micro-checkin
            "emotion_hidden": None,
            "timestamp": timestamp_now,
            "last_updated": timestamp_now
        }


        journals_collection.update_one(
            {"username": username},
            {"$setOnInsert": {"username": username, "entries": []},
             "$set": {"last_updated": timestamp_now}},
            upsert=True
        )

        update_result = journals_collection.update_one(
            {"username": username, "entries.date": date},
            {"$set": {"entries.$": new_entry}}
        )

        if update_result.matched_count == 0:
            journals_collection.update_one(
                {"username": username},
                {"$push": {"entries": new_entry}}
            )

        # -----------------------------
        # 2️⃣ SINGLE AI CALL FOR EMOTION + QUESTION
        # -----------------------------
        emotion_prompt = f"""
        You are an emotionally intelligent journaling AI.

        User's micro check-in:
        {json.dumps(micro_checkin, indent=2)}

        Tasks:
        1. Identify ONE dominant emotion from:
        [Happy, Sad, Anxious, Stressed, Angry, Lonely, Grateful, Hopeful, Guilty, Conflicted]

        2. Generate ONE validation question:
           - yes/no
           - choice (2-3 options)
           - reflection (short)

        Respond EXACTLY in JSON:
        {{
            "emotion": "EmotionHere",
            "question_type": "yes_no | choice | reflection",
            "question": "Your question here",
            "options": ["opt1", "opt2"]
        }}

        Journal: "{entry_text}"
        """

        ai_raw = None
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": emotion_prompt}]
            )
            ai_raw = response.choices[0].message.content.strip()
            ai_raw = ai_raw.replace("```json", "").replace("```", "").strip()
            emotion_data = json.loads(ai_raw)

        except Exception as e:
            app.logger.error(f"AI JSON ERROR: {e}\nRAW: {ai_raw if ai_raw else 'NO AI OUTPUT'}")
            emotion_data = {
                "emotion": "Unknown",
                "question_type": "reflection",
                "question": "Can you tell me more about how you're feeling?",
                "options": []
            }



        dominant_emotion = emotion_data.get("emotion", "Unknown")

        # -----------------------------
        # 3️⃣ UPDATE JOURNAL WITH EMOTION
        # -----------------------------
        journals_collection.update_one(
            {"username": username, "entries.date": date},
            {"$set": {"entries.$.emotion_hidden": dominant_emotion}}
        )

        # -----------------------------
        # 4️⃣ RETURN FIRST VALIDATION QUESTION
        # -----------------------------
        return jsonify({
            "message": "Journal saved",
            "emotion_hidden": dominant_emotion,
            "question_type": emotion_data.get("question_type"),
            "question": emotion_data.get("question"),
            "options": emotion_data.get("options") or []
        }), 200

    except Exception as e:
        app.logger.error("SERVER ERROR (/save-journal): %s\n%s", e, traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500


@app.route('/answer-question', methods=['POST'])
def answer_question():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        username = (data.get('username') or "").strip()
        date = data.get('date') or datetime.utcnow().strftime('%Y-%m-%d')
        answer_text = (data.get('answer') or "").strip()

        if not username:
            return jsonify({'error': 'Missing username'}), 400
        if not answer_text:
            return jsonify({'error': 'Missing answer'}), 400

        sessions_col = mongo.db.validation_sessions
        journals_col = mongo.db.journals
        timestamp_now = datetime.utcnow()

        # Try to find existing session
        session_doc = sessions_col.find_one({"username": username, "date": date})

        # If no session exists, create one from the saved journal entry (upsert-style so duplicate requests are OK)
        if not session_doc:
            user_doc = journals_col.find_one({"username": username})
            if not user_doc:
                return jsonify({"error": "No journal found for user"}), 404

            entry_obj = next((e for e in user_doc.get("entries", []) if e.get("date") == date), None)
            if not entry_obj:
                return jsonify({"error": "No journal entry for that date"}), 404

            encrypted = entry_obj.get("text", "") or ""
            journal_text = decrypt_text_safe(encrypted) or ""
            emotion_hidden = entry_obj.get("emotion_hidden", "Unknown")

            # Upsert a session doc
            sessions_col.update_one(
                {"username": username, "date": date},
                {"$setOnInsert": {
                    "username": username,
                    "date": date,
                    "journal_text": journal_text,
                    "emotion_hidden": emotion_hidden,
                    "answers": [],
                    "last_answered_step": 0,
                    "created_at": timestamp_now,
                    "updated_at": timestamp_now,
                    "completed": False
                }},
                upsert=True
            )
            session_doc = sessions_col.find_one({"username": username, "date": date})

        # if session completed
        if session_doc.get("completed"):
            return jsonify({"error": "Validation session already completed. Call /complete or start a new journal."}), 400

        last_step = int(session_doc.get("last_answered_step", 0))
        next_step = last_step + 1

        # limit to 3 steps
        if next_step > 3:
            return jsonify({"message": "All questions already answered. Call /complete to finish.", "complete": True}), 200

        # append answer
        sessions_col.update_one(
            {"username": username, "date": date},
            {"$push": {"answers": {"step": next_step, "answer": answer_text}}, "$set": {"last_answered_step": next_step, "updated_at": timestamp_now}}
        )

        # after saving, if we've reached 3 answers => ask client to call /complete
        if next_step >= 3:
            return jsonify({
                "message": "All questions answered. Call /complete to generate your affirmation and advice.",
                "complete": True
            }), 200

        # otherwise generate the next question
        session_doc = sessions_col.find_one({"username": username, "date": date})  # refresh
        answers_list = session_doc.get("answers", []) or []
        answers_context = "\n".join([f"Q{a['step']}_answer: {a['answer']}" for a in answers_list])

        # ask for the next question
        question_prompt = f""" You are an emotionally intelligent journaling assistant. Do NOT reveal the detected emotion to the user.  Context: Journal: \"\"\"{session_doc.get('journal_text','')}\"\"\" Previous answers: {answers_context}  Task: Based on the journal and previous answers, generate ONE interactive validation question to ask next. - If the next question should be a Yes/No question, set question_type = "yes_no". - If it should be a short multiple-choice, set question_type = "choice" and provide 2-3 concise options. - If it should be a reflection prompt, set question_type = "reflection" and make it 1 short sentence.  Keep questions short, contextual, and directly tied to the journal & prior answers. Respond ONLY in JSON in this exact format (no extra text): {{   "question_type": "<yes_no | choice | reflection>",   "question": "<the question text>",   "options": ["opt1","opt2"]   # include only when question_type is "choice" }} """

        ai_raw = None

        try:
            # Use Groq instead of Gemini
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": question_prompt}]
            )

            ai_raw = response.choices[0].message.content.strip()
            ai_raw = ai_raw.replace("```json", "").replace("```", "").strip()

            q_data = json.loads(ai_raw)

        except Exception as e:
            app.logger.error("NEXT QUESTION JSON ERROR: %s\nRAW: %s", e, ai_raw if ai_raw else "NO AI OUTPUT")
            
            # Fallback question
            q_data = {
                "question_type": "reflection",
                "question": "How did that make you feel?",
                "options": []
            }


        # Extract values
        q_type = q_data.get("question_type", "reflection")
        q_text = q_data.get("question", "How did that make you feel?")
        q_options = q_data.get("options") or []

        # Save next question into session
        upcoming_step = int(session_doc.get("last_answered_step", 0)) + 2

        sessions_col.update_one(
            {"username": username, "date": date},
            {
                "$set": {
                    "next_question": {
                        "step": upcoming_step,
                        "question_type": q_type,
                        "question": q_text,
                        "options": q_options
                    },
                    "updated_at": timestamp_now
                }
            }
        )


        response_payload = {
            "message": "Next question",
            "question_type": q_type,
            "question": q_text,
            "options": q_options
        }

        return jsonify(response_payload), 200

    except Exception as e:
        app.logger.error("SERVER ERROR (/answer-question): %s\n%s", e, traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500


@app.route('/complete', methods=['POST'])
def complete_validation_and_create_advice():
    try:
        data = request.get_json(silent=True) or {}
        username = (data.get('username') or "").strip()
        date = data.get('date') or datetime.utcnow().strftime('%Y-%m-%d')

        if not username:
            return jsonify({'error': 'Missing username'}), 400

        sessions_col = mongo.db.validation_sessions
        journals_col = mongo.db.journals
        tasks_col = mongo.db.wellbeing_tasks
        history_col = mongo.db.emotion_history

        session_doc = sessions_col.find_one({"username": username, "date": date})
        if not session_doc:
            return jsonify({"error": "No active validation session found"}), 404

        if session_doc.get("completed"):
            result = session_doc.get("result", {})
            return jsonify({
                "message": "Already completed",
                "advice": result.get("advice"),
                "affirmation": result.get("affirmation")
            }), 200

        answers = session_doc.get("answers", [])
        if len(answers) < 1:
            return jsonify({"error": "At least one validation answer required"}), 400

        journal_text = session_doc.get("journal_text", "")
        emotion_hidden = session_doc.get("emotion_hidden", "Unknown")
        answers_context = "\n".join([f"Q{a['step']}_answer: {a['answer']}" for a in answers])

        # -----------------------------
        # GENERATE FINAL ADVICE
        # -----------------------------
        final_prompt = f"""
You are a compassionate journaling coach. Do NOT reveal the detected emotion to the user.

Context:
Journal: \"\"\"{journal_text}\"\"\"
Validation answers:
{answers_context}

Task:
1) Generate a short, practical piece of advice (2–3 sentences) directly based on the journal + answers.
2) Generate a single-line supportive affirmation.

Rules:
- Respond ONLY in valid JSON.
- Use EXACT keys: "advice", "affirmation".
- NO commentary, NO markdown, NO explanation, NO extra text.
- Do NOT talk about being an AI model.

JSON FORMAT:
{{
  "advice": "<2–3 sentences>",
  "affirmation": "<1 short supportive sentence>"
}}
"""

        ai_raw = None

        try:
            # Groq API call instead of Gemini
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": final_prompt}]
            )

            ai_raw = response.choices[0].message.content.strip()
            ai_raw = ai_raw.replace("```json", "").replace("```", "").strip()

            final_data = json.loads(ai_raw)

        except Exception as e:
            app.logger.error("FINAL JSON ERROR: %s\nRAW FINAL: %s", e, ai_raw if ai_raw else "NO AI OUTPUT")
            return jsonify({"error": "Invalid AI JSON"}), 500


        # Extract final advice + affirmation
        advice_text = final_data.get("advice", "").strip()
        affirmation_text = final_data.get("affirmation", "").strip()


        # -----------------------------
        # UPDATE JOURNAL ENTRY
        # -----------------------------
        user_doc = journals_col.find_one({"username": username})
        entry_obj = next(e for e in user_doc["entries"] if e["date"] == date)

        updated_entry = entry_obj.copy()
        updated_entry["ai_advice"] = advice_text
        updated_entry["ai_affirmation"] = affirmation_text
        updated_entry["last_updated"] = datetime.utcnow()

        journals_col.update_one(
            {"username": username, "entries.date": date},
            {"$set": {"entries.$": updated_entry}}
        )

        # -----------------------------
        # MARK VALIDATION AS COMPLETE
        # -----------------------------
        sessions_col.update_one(
            {"username": username, "date": date},
            {"$set": {
                "completed": True,
                "completed_at": datetime.utcnow(),
                "result": {"advice": advice_text, "affirmation": affirmation_text}
            }}
        )

        # -----------------------------
        # LOG EMOTION HISTORY
        # -----------------------------
        history_col.insert_one({
            "username": username,
            "date": date,
            "emotion": emotion_hidden,
            "timestamp": datetime.utcnow()
        })

        # -----------------------------
        # ASSIGN WELLBEING TASKS
        # -----------------------------
        from task_library import pick_tasks
        selected_tasks = pick_tasks(emotion_hidden, count=3)

        expires_at = datetime.utcnow() + timedelta(minutes=30)

        tasks_payload = {
            "username": username,
            "date": date,
            "emotion": emotion_hidden,
            "tasks": [
                {
                    "id": t["id"],
                    "title": t["title"],
                    "duration": t["duration"],
                    "type": t["type"],
                    "expires_at": expires_at,
                    "status": "pending"
                }
                for t in selected_tasks
            ],
            "created_at": datetime.utcnow()
        }

        # -----------------------------
        # UPSERT WELLBEING TASKS
        # -----------------------------
        tasks_col.update_one(
            {"username": username, "date": date},   # match today's tasks for this user
            {
                "$set": {
                    "emotion": emotion_hidden,
                    "tasks": tasks_payload["tasks"],
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )


        # -----------------------------
        # RETURN FINAL RESPONSE
        # -----------------------------
        return jsonify({
            "message": "Validation complete",
            "advice": advice_text,
            "affirmation": affirmation_text,
            "tasks_assigned": tasks_payload["tasks"]
        }), 200

    except Exception as e:
        app.logger.error("SERVER ERROR (/complete): %s\n%s", e, traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500


# TASKS
@app.route('/get-tasks', methods=['GET'])
def get_tasks():
    username = request.args.get("username")
    tasks = list(mongo.db.wellbeing_tasks.find({"username": username}))
    
    # Flatten: list of task objects
    task_list = []
    for doc in tasks:
        for t in doc.get("tasks", []):
            if t["status"] == "pending":
                task_list.append(t)

    return jsonify({"tasks": task_list})

@app.route('/complete-task', methods=['POST'])
def complete_task():
    
    try:
        print("📥 RAW DATA:", request.data)
        print("📥 HEADERS:", request.headers)

        data = request.get_json(force=True, silent=False)
    except Exception as e:
        print("❌ JSON parse error:", e)
        return jsonify({"error": "Invalid JSON"}), 400

    username = data.get("username")
    task_id = data.get("task_id")

    print("🔥 DEBUG username:", username)
    print("🔥 DEBUG task_id:", task_id)

    if not username or not task_id:
        return jsonify({"error": "Missing username or task_id"}), 400

    result = mongo.db.wellbeing_tasks.update_one(
        {"username": username, "tasks.id": task_id},
        {"$set": {"tasks.$.status": "completed"}}
        
    )

    if result.modified_count == 0:
        return jsonify({"error": "Task not found for this user"}), 404

    return jsonify({"message": "Task completed"}), 200



@app.route("/get-task")
def get_task():
    try:
        task_id = request.args.get("task_id")

        if not task_id:
            return jsonify({"error": "Missing task_id"}), 400

        # Just find the task anywhere in the array
        doc = mongo.db.wellbeing_tasks.find_one({"tasks.id": task_id})

        if not doc:
            return jsonify({"error": "Task not found"}), 404

        # Extract specific task
        task = next((t for t in doc["tasks"] if t["id"] == task_id), None)

        return jsonify({"task": task}), 200

    except Exception as e:
        print("ERROR /get-task:", e)
        return jsonify({"error": "Internal server error"}), 500




@app.route('/affirmations', methods=['POST'])
def get_journals():
    try:
        data = request.get_json(force=True)
        print("✅ Received data:", data)

        if not isinstance(data, dict):
            return jsonify({'message': 'Invalid JSON format'}), 400

        username = data.get('username')
        if not username:
            return jsonify({'message': 'Username is required'}), 400

        # Fetch all journals of this user
        journals = list(mongo.db.journals.find({'username': username}))
        response_data = []

        for journal in journals:
            entries = journal.get('entries', [])

            for entry in entries:
                if not isinstance(entry, dict):
                    print("⚠️ Skipping malformed entry:", entry)
                    continue

                # ----------------------------------------------------
                # 1️⃣ Determine correct date
                # ----------------------------------------------------
                entry_date = entry.get("date") or entry.get("timestamp")
                if entry_date:
                    if isinstance(entry_date, str) and "T" in entry_date:
                        entry_date = entry_date.split("T")[0]  # Extract YYYY-MM-DD
                    else:
                        entry_date = str(entry_date)
                else:
                    print("⚠️ Skipping entry without date:", entry)
                    continue

                # ----------------------------------------------------
                # 2️⃣ DECRYPT THE TEXT SAFELY
                # ----------------------------------------------------
                encrypted_text = entry.get("text", "")
                text_plain = decrypt_text_safe(encrypted_text)

                # ----------------------------------------------------
                # 3️⃣ Make timestamp ISO (JSON safe)
                # ----------------------------------------------------
                ts = entry.get("timestamp")
                if isinstance(ts, datetime):
                    ts = ts.isoformat()
                else:
                    ts = str(ts) if ts is not None else None

                # ----------------------------------------------------
                # 4️⃣ Prepare final response object
                # ----------------------------------------------------
                response_data.append({
                    "date": entry_date,
                    "text": text_plain,  # decrypted text
                    "sentiment": entry.get("sentiment") or entry.get("emotion_hidden") or "Unknown",
                    "emotion_hidden": entry.get("emotion_hidden"),
                    "affirmation": (entry.get("ai_affirmation") or "").strip(),
                    "advice": (entry.get("ai_advice") or "").strip(),
                    "timestamp": ts
                })

        return jsonify({"journals": response_data}), 200

    except Exception as e:
        print("🔥 Error fetching journals:", e)
        return jsonify({"message": "Error fetching journals"}), 500

# Flask example
# ------------------------- GET SINGLE JOURNAL (DAILY) -------------------------
@app.route("/get-journal")
def get_journal():
    username = request.args.get("username")
    date = request.args.get("date")            # format: YYYY-MM-DD
    date_prefix = request.args.get("datePrefix")  # format: YYYY-MM

    if not username:
        return jsonify({"error": "username missing"}), 400

    journals = mongo.db.journals.find_one({"username": username})
    if not journals:
        return jsonify({"entries": []})

    entries = journals.get("entries", [])

    # CASE 1: Daily Fetch
    if date:
        for e in entries:
            if e["date"] == date:
                encrypted_text = e.get("text", "")
                if encrypted_text:
                    decrypted_text = fernet.decrypt(encrypted_text.encode()).decode()
                else:
                    decrypted_text = ""
                return jsonify({"text": decrypted_text})
        return jsonify({"text": ""})

    # CASE 2: Monthly Fetch
    if date_prefix:
        filtered = []
        for e in entries:
            if e["date"].startswith(date_prefix):
                encrypted_text = e.get("text", "")
                decrypted_text = fernet.decrypt(encrypted_text.encode()).decode()
                filtered.append({
                    "date": e["date"],
                    "text": decrypted_text
                })
        return jsonify({"entries": filtered})


    return jsonify({"error": "No valid query parameter provided"}), 400


@app.route('/update-calm-quest', methods=['POST'])
def update_calm_quest():
    try:
        data = request.get_json()
        print("Received update-calm-quest data:", data)
        username = data.get("username")

        if not username:
            print("No username in request")
            return jsonify({'message': 'Username required'}), 400

        today = datetime.now().strftime("%Y-%m-%d")
        collection = mongo.db.calm_quest
        record = collection.find_one({"username": username})
        print("Existing record:", record)

        if not record:
            new_doc = {"username": username, "streak": 1, "last_completed": today}
            collection.insert_one(new_doc)
            print("Inserted new record:", new_doc)
            return jsonify(new_doc), 200

        last_date = record.get("last_completed")  # could be None
        print("last_date:", last_date, "today:", today)

        if last_date == today:
            # already done today
            return jsonify({
                "username": username,
                "streak": record.get("streak", 0),
                "last_completed": last_date
            }), 200

        # if last_date is None or not parseable, reset to 1
        try:
            if last_date:
                last_dt = datetime.strptime(last_date, "%Y-%m-%d")
                today_dt = datetime.strptime(today, "%Y-%m-%d")
                delta_days = (today_dt - last_dt).days
            else:
                delta_days = None
        except Exception as e:
            print("Error parsing last_date:", e)
            delta_days = None

        if delta_days == 1:
            new_streak = record.get("streak", 0) + 1
        else:
            new_streak = 1

        collection.update_one(
            {"username": username},
            {"$set": {"streak": new_streak, "last_completed": today}}
        )

        print("Updated streak to", new_streak)
        return jsonify({
            "username": username,
            "streak": new_streak,
            "last_completed": today
        }), 200

    except Exception as e:
        print("🔥 Error in update-calm-quest:", e)
        return jsonify({"message": "Error updating streak"}), 500



@app.route('/get-calm-quest', methods=['GET'])
def get_calm_quest():
    try:
        username = request.args.get("username")

        if not username:
            return jsonify({'message': 'Username is required'}), 400

        record = mongo.db.calm_quest.find_one(
            {"username": username},
            {"_id": 0}  # ⬅️ EXCLUDE ObjectId
        )

        # If not found → create a new entry
        if not record:
            new_record = {
                "username": username,
                "streak": 0,
                "last_completed": None
            }
            mongo.db.calm_quest.insert_one(new_record)
            return jsonify(new_record), 200

        return jsonify(record), 200

    except Exception as e:
        print("🔥 Error:", e)
        return jsonify({"message": "Error retrieving streak"}), 500




@app.route('/api/get-username', methods=['GET'])
def get_username():
    return jsonify({'username': 'your_test_username'})


from calendar import month_name
from operator import itemgetter

@app.route('/summaries/<username>', methods=['GET'])
def get_summaries_by_username(username):
    """
    GET /summaries/<username>
    Returns JSON:
      { "username": "...", "summaries": [ {month, year, summary, last_journal_date}, ... ] }
    If no document exists returns { "username": username, "summaries": [] }
    """
    try:
        if not username:
            return jsonify({"error": "Username required"}), 400

        doc = summaries_collection.find_one({"username": username}, {"_id": 0})
        if not doc:
            return jsonify({"username": username, "summaries": []}), 200

        summaries = doc.get("summaries", []) or []

        # Normalize months to consistent dicts and sort chronologically (year then month index)
        def month_index(m):
            # handle both full month names and numeric months if supplied
            try:
                # if 'month' is a string like "November"
                return list(month_name).index(m.get("month")) if isinstance(m.get("month"), str) else int(m.get("month"))
            except Exception:
                return 0

        # Ensure all entries have year as int
        for s in summaries:
            try:
                s["year"] = int(s.get("year", 0))
            except:
                s["year"] = 0

        # sort by year ascending, month index ascending
        summaries_sorted = sorted(
            summaries,
            key=lambda s: (s.get("year", 0), month_index(s))
        )

        return jsonify({
            "username": username,
            "summaries": summaries_sorted
        }), 200

    except Exception as e:
        print("🔥 Error in /summaries/<username>:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/get-summaries', methods=['GET'])
def get_summaries_query():
    """
    GET /get-summaries?username=...
    Backwards-compatible wrapper.
    """
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "username query param required"}), 400
    return get_summaries_by_username(username)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5010)

