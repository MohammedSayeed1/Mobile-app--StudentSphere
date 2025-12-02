from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import bcrypt
import os
import json
from dotenv import load_dotenv
from datetime import datetime
import google.generativeai as genai
from collections import defaultdict
from cryptography.fernet import Fernet

# Load environment variables
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
ENCRYPTION_KEY = os.getenv("FERNET_KEY")
# Load Fernet key
ENCRYPTION_KEY = os.getenv("FERNET_KEY")

if not ENCRYPTION_KEY:
    raise ValueError("❌ FERNET_KEY is missing. Add it in your .env")

# Fernet expects BYTES, not a string
fernet = Fernet(ENCRYPTION_KEY.encode())

# Choose model
model = genai.GenerativeModel("gemini-2.0-flash")

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
    try:
        data = request.json
        username = data.get('username')
        entry_text = data.get('entry')
        date = data.get('date', datetime.utcnow().strftime('%Y-%m-%d'))

        if not username or not entry_text:
            return jsonify({'error': 'Missing username or entry'}), 400

        journals_collection = mongo.db.journals
        memories_collection = mongo.db.memories
        summaries_collection = mongo.db.summaries


        timestamp_now = datetime.utcnow()

        # -----------------------------
        # 1️⃣ SENTIMENT + AFFIRMATION + ADVICE (YOUR PROMPT)
        # -----------------------------
        sentiment_prompt = f"""
You are a kind and thoughtful mental health assistant. Read the following journal entry and determine the **single most dominant emotion** the writer is expressing.

The sentiment must be **only one** from this list:
[Happy, Sad, Anxious, Stressed, Angry, Lonely, Grateful, Hopeful, Guilty, Conflicted]

Then, generate:
1. A short, supportive affirmation (1–2 lines).
2. A brief piece of advice (1–2 lines).

Journal Entry:
\"{entry_text}\"

Respond **only** in valid JSON (no markdown, no backticks):
{{
  "sentiment": "<one emotion>",
  "affirmation": "<short supportive affirmation>",
  "advice": "<short helpful advice>"
}}
"""

        ai_response = model.generate_content(sentiment_prompt).text.strip()
        ai_response = ai_response.replace("```json", "").replace("```", "").strip()

        try:
            sentiment_data = json.loads(ai_response)
        except Exception as e:
            print("🔥 SENTIMENT JSON ERROR:", e)
          
            return jsonify({"error": "Invalid AI JSON"}), 500

        sentiment = sentiment_data.get("sentiment", "Unknown")
        ai_affirmation = sentiment_data.get("affirmation", "")
        ai_advice = sentiment_data.get("advice", "")

        # -----------------------------
        # 2️⃣ MEMORY EXTRACTION (YOUR PROMPT)
        # -----------------------------
        memory_prompt = f"""
You are an empathetic journaling assistant. Read the following journal entry and decide if it contains a meaningful personal moment worth saving — something the user might want to remember later (gratitude, kindness, realization, joy).

If NO meaningful moment exists, respond:
{{"save_memory": false}}

If YES, respond exactly like this:
{{
  "save_memory": true,
  "memory": "<1–3 sentence emotional reflection written from user's perspective>"
}}

Guidelines:
- Use “I felt…”, “I realized…”, “It reminded me…”
- Make it warm and nostalgic.
- Do NOT repeat the entire story.

Journal Entry:
\"{entry_text}\"

Respond ONLY in JSON. No markdown.
"""

        memory_raw = model.generate_content(memory_prompt).text.strip()
        memory_raw = memory_raw.replace("```json", "").replace("```", "").strip()

        try:
            memory_data = json.loads(memory_raw)
        except Exception as e:
            print("🔥 MEMORY JSON ERROR:", e)
            print("RAW MEMORY AI:", memory_raw)
            memory_data = {"save_memory": False}

        # Save memory if valid
        # -----------------------------
# SAVE MEMORY IN USER-DOCUMENT FORMAT
# -----------------------------
        if memory_data.get("save_memory") and memory_data.get("memory"):

            new_memory = memory_data["memory"]

            # Get user's memory document (one per user)
            existing_user_memory = memories_collection.find_one({"username": username})

            if existing_user_memory:
                memories_list = existing_user_memory.get("memories", [])

                # Check if today's date already exists in memories[]
                existing_entry = next((m for m in memories_list if m["date"] == date), None)

                if existing_entry:
                    # 🔄 Replace memory of that date (no duplicates)
                    existing_entry["memory"] = new_memory
                else:
                    # ➕ Add new date-memory object
                    memories_list.append({
                        "date": date,
                        "memory": new_memory
                    })

                # Update the main document
                memories_collection.update_one(
                    {"username": username},
                    {
                        "$set": {
                            "memories": memories_list,
                            "last_updated": timestamp_now
                        }
                    }
                )

            else:
                # First memory document for this user
                memories_collection.insert_one({
                    "username": username,
                    "memories": [
                        {
                            "date": date,
                            "memory": new_memory
                        }
                    ],
                    "last_updated": timestamp_now
                })


        # -----------------------------
        # 3️⃣ CREATE JOURNAL ENTRY OBJECT
        # -----------------------------
        # -----------------------------
        # 3️⃣ CREATE JOURNAL ENTRY OBJECT
        # -----------------------------
        new_entry = {
            "date": date,
            "text": encrypt_text(entry_text),
            "sentiment": sentiment,
            "ai_affirmation": ai_affirmation,
            "ai_advice": ai_advice,
            "timestamp": timestamp_now,
            "last_updated": timestamp_now
        }

        # -----------------------------
        # 4️⃣ SAVE TO entries[] FORMAT
        # -----------------------------

        # Ensure user has one document
        journals_collection.update_one(
            {"username": username},
            {
                "$setOnInsert": {
                    "username": username,
                    "entries": []
                },
                "$set": {"last_updated": timestamp_now}
            },
            upsert=True
        )

        # Try to replace existing entry for same date
        update_result = journals_collection.update_one(
            {"username": username, "entries.date": date},
            {"$set": {"entries.$": new_entry}}
        )

        # If no entry exists for that date → push new entry
        if update_result.matched_count == 0:
            journals_collection.update_one(
                {"username": username},
                {"$push": {"entries": new_entry}}
            )
        # -----------------------------
        # 4️⃣ MONTHLY SUMMARY GENERATION + STORE IN summaries COLLECTION
        # -----------------------------
        # Get month & year from the 'date' string
        try:
            dt = datetime.strptime(date, "%Y-%m-%d")
            month_name = dt.strftime("%B")   # e.g. "November"
            year_num = dt.year               # e.g. 2025
        except Exception as e:
            print("🔥 Date parse error for summary:", e)
            month_name = datetime.utcnow().strftime("%B")
            year_num = datetime.utcnow().year

        # Collect all entries for the same user in the same month/year
        # First fetch the user's single document
        user_doc = journals_collection.find_one({"username": username})
        month_texts = []
        if user_doc:
            for e in user_doc.get("entries", []):
                try:
                    entry_dt = datetime.strptime(e.get("date", ""), "%Y-%m-%d")
                    if entry_dt.month == dt.month and entry_dt.year == dt.year:
                        encrypted = e.get("text", "")
                        decrypted = decrypt_text_safe(encrypted)
                        if decrypted and decrypted.strip():
                            month_texts.append(decrypted)
                except Exception:
                    continue


        # If we have texts for the month, create a summary
        if month_texts:
            full_text = "\n\n".join([t for t in month_texts if t and t.strip()])

            # Prompt for monthly summary (2-3 sentences)
            summary_prompt = f"""
You are a reflective journaling assistant.

Summarize this month's emotions and overall mental health **from the user's perspective**, 
using warm, personal, first-person language (“I felt…”, “I realized…”, “This month taught me…”).

Guidelines:
- Keep it 2–3 lines.
- Make it sound like a personal reflection.
- Do NOT speak like an outside observer.
- Do NOT mention “the user”, “they”, or “their”.
- Do NOT add advice or commentary — only the summary.

Write it as if the user is summarizing their own month.

Texts:
{full_text}
"""

            try:
                ai_summary_raw = model.generate_content(summary_prompt).text.strip()
                # Remove markdown fences if any
                ai_summary_raw = ai_summary_raw.replace("```", "").strip()
                summary_text = ai_summary_raw
            except Exception as e:
                print("🔥 Summary generation error:", e)
                summary_text = ""

            # Upsert into summaries_collection (one document per user, summaries array)
            existing_summary_doc = summaries_collection.find_one({"username": username})
            month_key = f"{month_name} {year_num}"   # friendly label

            if existing_summary_doc:
                summaries_list = existing_summary_doc.get("summaries", [])
                # find existing month entry
                existing_month = next((s for s in summaries_list if s.get("month") == month_name and s.get("year") == year_num), None)
                if existing_month:
                    existing_month["summary"] = summary_text
                    existing_month["last_journal_date"] = date
                else:
                    summaries_list.append({
                        "month": month_name,
                        "year": year_num,
                        "summary": summary_text,
                        "last_journal_date": date
                    })
                summaries_collection.update_one(
                    {"username": username},
                    {"$set": {"summaries": summaries_list, "last_updated": timestamp_now}}
                )
            else:
                summaries_collection.insert_one({
                    "username": username,
                    "summaries": [{
                        "month": month_name,
                        "year": year_num,
                        "summary": summary_text,
                        "last_journal_date": date
                    }],
                    "last_updated": timestamp_now
                })


        # -----------------------------
        # 5️⃣ RESPONSE
        # -----------------------------
        return jsonify({
            "message": "Journal saved successfully",
            "sentiment": sentiment,
            "ai_affirmation": ai_affirmation,
            "ai_advice": ai_advice
        }), 200

    except Exception as e:
        print("🔥 SERVER ERROR:", e)
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
                    "sentiment": (entry.get("sentiment") or "").strip(),
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

