# task_library.py
# Stores all wellbeing tasks for Emotion-Adaptive Support System (EASS)

import random
from datetime import datetime, timedelta

EMOTION_TASKS = {

    # ---------------------------------------------------------
    # HAPPY
    # ---------------------------------------------------------
    "Happy": [
        {
            "id": "happy_celebrate_win",
            "title": "Celebrate a Win",
            "description": "Write 3 things that went well today to reinforce positive memory consolidation.",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "low"
        },
        # {
        #     "id": "happy_share_joy",
        #     "title": "Share the Joy",
        #     "description": "Send a short message to one friend about something good that happened.",
        #     "duration": 3,
        #     "type": "Social",
        #     "intensity": "low"
        # },
        # {
        #     "id": "happy_savor_photo",
        #     "title": "Savoring Photo",
        #     "description": "Take a photo of something that made you smile and write one sentence about it.",
        #     "duration": 5,
        #     "type": "Creative",
        #     "intensity": "low"
        # },
        # {
        #     "id": "happy_gratitude_microlist",
        #     "title": "Gratitude Microlist",
        #     "description": "List 3 people you're thankful for and why.",
        #     "duration": 4,
        #     "type": "Cognitive",
        #     "intensity": "low"
        # },
        # {
        #     "id": "happy_amplify",
        #     "title": "Amplify the Moment",
        #     "description": "Pick one happy event and describe it in 5 sentences.",
        #     "duration": 6,
        #     "type": "Cognitive",
        #     "intensity": "medium"
        # },
        # {
        #     "id": "happy_affirmation_create",
        #     "title": "Create an Affirmation",
        #     "description": "Write one short affirmation you can reuse later.",
        #     "duration": 2,
        #     "type": "Cognitive",
        #     "intensity": "low"
        # },
        {
            "id": "happy_spread_kindness",
            "title": "Spread Kindness",
            "description": "Perform one small helpful action toward someone.",
            "duration": 10,
            "type": "Social",
            "intensity": "medium"
        },
        {
            "id": "happy_playlist",
            "title": "Create a Mood Playlist",
            "description": "Add 3 upbeat songs to a playlist called 'Mood Boost'.",
            "duration": 7,
            "type": "Creative",
            "intensity": "medium"
        },
        # {
        #     "id": "happy_creative_burst",
        #     "title": "Mini Creative Burst",
        #     "description": "Doodle or make a 1-minute sketch of something positive.",
        #     "duration": 3,
        #     "type": "Creative",
        #     "intensity": "low"
        # },
        # {
        #     "id": "happy_micro_reward",
        #     "title": "Plan a Micro-Reward",
        #     "description": "Schedule a small treat for later today.",
        #     "duration": 2,
        #     "type": "Behavioral",
        #     "intensity": "low"
        # },
    ],


    # ---------------------------------------------------------
    # SAD
    # ---------------------------------------------------------
    "Sad": [
        {
            "id": "sad_breathing",
            "title": "Box Breathing 4-4-4",
            "description": "A calming breath cycle to reduce emotional overload.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "sad_permission",
            "title": "Permission to Feel",
            "description": "Write: 'It's okay that I feel ___' to validate your emotions.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "sad_activation",
            "title": "Behavioral Activation",
            "description": "Complete one tiny achievable task (tea, window open).",
            "duration": 7,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "sad_connect",
            "title": "Reach Out",
            "description": "Send a quick 'Hey, can we chat later?' message.",
            "duration": 2,
            "type": "Social",
            "intensity": "low"
        },
        {
            "id": "sad_safe_distraction",
            "title": "Soothing Nature Audio",
            "description": "Listen to calming sounds for 5 minutes.",
            "duration": 5,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "sad_micro_gratitude",
            "title": "One Small Gratitude",
            "description": "Write one thing you appreciated today.",
            "duration": 2,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "sad_future_self",
            "title": "Write to Future Self",
            "description": "Write what you would say to a friend in this situation.",
            "duration": 6,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "sad_movement",
            "title": "Gentle Movement",
            "description": "Do a 3-minute stretch or slow walk.",
            "duration": 4,
            "type": "Behavioral",
            "intensity": "low"
        },
        {
            "id": "sad_memory_box",
            "title": "Memory Box",
            "description": "Look at a positive photo and write why it matters.",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "sad_help_plan",
            "title": "Plan for Support",
            "description": "List 2 people or resources you'd contact if you feel worse.",
            "duration": 3,
            "type": "ProblemSolve",
            "intensity": "low"
        },
    ],


    # ---------------------------------------------------------
    # ANXIOUS
    # ---------------------------------------------------------
    "Anxious": [
        {
            "id": "anx_54321",
            "title": "5-4-3-2-1 Grounding",
            "description": "Use your senses to anchor into the present moment.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "anx_box_breath",
            "title": "Box Breathing",
            "description": "Slow breathing to reduce bodily anxiety symptoms.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "anx_worry_parking",
            "title": "Worry Parking",
            "description": "Write your worry for 3 minutes & schedule a time to revisit.",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "anx_muscle_relaxation",
            "title": "Muscle Relaxation",
            "description": "Progressively tense and relax your muscles.",
            "duration": 6,
            "type": "Calm",
            "intensity": "medium"
        },
        {
            "id": "anx_reality_check",
            "title": "Reality Check",
            "description": "Ask: worst, best, and most likely outcome?",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "anx_visualize_safe",
            "title": "Safe Place Visualization",
            "description": "Imagine a calming safe place while breathing slowly.",
            "duration": 4,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "anx_pomodoro",
            "title": "15-Minute Focus Reset",
            "description": "A short focused block to regain control.",
            "duration": 15,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "anx_voice_note",
            "title": "Talk-It-Out Voice Note",
            "description": "Record a 2-minute explanation of your worry.",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "anx_movement",
            "title": "Movement Burst",
            "description": "Do a quick brisk walk or jumping jacks.",
            "duration": 3,
            "type": "Behavioral",
            "intensity": "low"
        },
        {
            "id": "anx_safety_steps",
            "title": "Safety Checklist",
            "description": "List 3 coping steps you’ll use if anxiety spikes.",
            "duration": 3,
            "type": "ProblemSolve",
            "intensity": "low"
        },
    ],


    # ---------------------------------------------------------
    # STRESSED
    # ---------------------------------------------------------
    "Stressed": [
        {
            "id": "stress_breathing",
            "title": "Box Breathing",
            "description": "Calms autonomic stress response.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "stress_priority",
            "title": "Micro-Priority List",
            "description": "Pick your top 2 tasks & ignore everything else.",
            "duration": 7,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "stress_relaxation",
            "title": "Progressive Relaxation",
            "description": "Relax head to toe slowly.",
            "duration": 6,
            "type": "Calm",
            "intensity": "medium"
        },
        {
            "id": "stress_pomodoro",
            "title": "Pomodoro Reset",
            "description": "25 minutes focused work.",
            "duration": 25,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "stress_visualization",
            "title": "Task Success Visualization",
            "description": "Imagine finishing a task successfully.",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "stress_stretch",
            "title": "Neck and Shoulder Stretch",
            "description": "Release tension stored in upper body.",
            "duration": 4,
            "type": "Behavioral",
            "intensity": "low"
        },
        {
            "id": "stress_decision_rule",
            "title": "60–40 Micro-Decision",
            "description": "Pick an option quickly to break indecision.",
            "duration": 3,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "stress_audio",
            "title": "Calming Audio + Water Sip",
            "description": "Listen to calming sound while hydrating.",
            "duration": 4,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "stress_ask_help",
            "title": "Ask for Help",
            "description": "Draft one message asking for support.",
            "duration": 3,
            "type": "Social",
            "intensity": "medium"
        },
        {
            "id": "stress_control_list",
            "title": "Control vs Not-in-Control List",
            "description": "Sort tasks into what you can and cannot control.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
    ],


    # ---------------------------------------------------------
    # ANGRY
    # ---------------------------------------------------------
    "Angry": [
        {
            "id": "angry_breath",
            "title": "Breath-Count Calm",
            "description": "Slow exhale breathing to reduce anger arousal.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "angry_timeout",
            "title": "Take a Time-Out",
            "description": "Step away and ground yourself.",
            "duration": 6,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "angry_write",
            "title": "Write It Out",
            "description": "Free-write feelings for 5 minutes.",
            "duration": 6,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "angry_physical",
            "title": "Physical Release",
            "description": "Do quick vigorous movement to discharge energy.",
            "duration": 4,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "angry_reframe",
            "title": "Perspective Shift",
            "description": "Write advice you'd give to a friend.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "angry_action_list",
            "title": "Regret vs Action List",
            "description": "Separate impulses from effective responses.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "angry_cooling_visual",
            "title": "Cooling Visualization",
            "description": "Imagine steam leaving your body.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "angry_safe_expression",
            "title": "Safe Voice Expression",
            "description": "Record a 1-minute voice memo and delete it.",
            "duration": 2,
            "type": "Behavioral",
            "intensity": "low"
        },
        {
            "id": "angry_apology_rehearsal",
            "title": "Apology Rehearsal",
            "description": "Draft a short accountability message (optional send).",
            "duration": 4,
            "type": "Social",
            "intensity": "medium"
        },
        {
            "id": "angry_problem_solve",
            "title": "Problem-Solve Step",
            "description": "Take one concrete action toward resolving the issue.",
            "duration": 6,
            "type": "ProblemSolve",
            "intensity": "medium"
        },
    ],


    # ---------------------------------------------------------
    # LONELY
    # ---------------------------------------------------------
    "Lonely": [
        {
            "id": "lonely_reachout",
            "title": "Reach Out",
            "description": "Send a 'Thinking of you' message to someone.",
            "duration": 3,
            "type": "Social",
            "intensity": "low"
        },
        {
            "id": "lonely_event",
            "title": "Find a Campus Event",
            "description": "Browse one event or club and save it.",
            "duration": 6,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "lonely_gratitude_people",
            "title": "Gratitude for Helpers",
            "description": "List 2 people who have helped you recently.",
            "duration": 3,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "lonely_micro_call",
            "title": "Schedule a 10-min Call",
            "description": "Plan a small meaningful chat.",
            "duration": 10,
            "type": "Social",
            "intensity": "medium"
        },
        {
            "id": "lonely_volunteer",
            "title": "Volunteer Micro-Task",
            "description": "Sign up for a short volunteer opportunity.",
            "duration": 15,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "lonely_letter",
            "title": "Write a Letter to Someone You Miss",
            "description": "Express thoughts even if you don't send it.",
            "duration": 6,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "lonely_livestream",
            "title": "Join a Live Event Online",
            "description": "Watch a livestream or panel for shared experience.",
            "duration": 12,
            "type": "Distraction",
            "intensity": "low"
        },
        {
            "id": "lonely_barrier_reflect",
            "title": "What Stops Me?",
            "description": "Reflect on barriers to reaching out.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "lonely_cozy_ritual",
            "title": "Create a Cozy Space",
            "description": "Play comforting music and set up a relaxing environment.",
            "duration": 12,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "lonely_buddy_checkin",
            "title": "Buddy Check-In",
            "description": "Ask someone how their week was.",
            "duration": 4,
            "type": "Social",
            "intensity": "low"
        },
    ],


    # ---------------------------------------------------------
    # GRATEFUL
    # ---------------------------------------------------------
    "Grateful": [
        {
            "id": "grateful_letter",
            "title": "Write a Gratitude Letter",
            "description": "Send or save a short thank-you message.",
            "duration": 6,
            "type": "Social",
            "intensity": "medium"
        },
        {
            "id": "grateful_walk",
            "title": "Savoring Walk",
            "description": "Observe 5 pleasant things around you.",
            "duration": 7,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "grateful_photo",
            "title": "Gratitude Album",
            "description": "Add one photo to your gratitude folder.",
            "duration": 4,
            "type": "Creative",
            "intensity": "low"
        },
        {
            "id": "grateful_share",
            "title": "Share Gratitude",
            "description": "Post or message something you're grateful for.",
            "duration": 3,
            "type": "Social",
            "intensity": "low"
        },
        {
            "id": "grateful_affirm",
            "title": "Create a Gratitude Affirmation",
            "description": "Write a one-line affirmation.",
            "duration": 2,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "grateful_pay_forward",
            "title": "Pay It Forward",
            "description": "Do one small kind act.",
            "duration": 10,
            "type": "Social",
            "intensity": "medium"
        },
        {
            "id": "grateful_reflect",
            "title": "Gratitude Reflection",
            "description": "List 3 things you're grateful for today.",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "grateful_breath",
            "title": "Gratitude Breathing",
            "description": "Pair 3 deep breaths with appreciation.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "grateful_memory",
            "title": "Recall a Supportive Moment",
            "description": "Write 5 sentences about a moment that mattered.",
            "duration": 6,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "grateful_ritual",
            "title": "Create a Gratitude Ritual",
            "description": "Set a daily 1-minute gratitude reminder.",
            "duration": 2,
            "type": "Behavioral",
            "intensity": "low"
        },
    ],


    # ---------------------------------------------------------
    # HOPEFUL
    # ---------------------------------------------------------
    "Hopeful": [
        {
            "id": "hope_future_self",
            "title": "Future-Self Note",
            "description": "Write a short message to your future self.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "hope_small_goal",
            "title": "Small Goal Step",
            "description": "Pick one small step toward something you hope for.",
            "duration": 10,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "hope_vision_board",
            "title": "Mini Vision Board",
            "description": "Save one image that represents your next goal.",
            "duration": 5,
            "type": "Creative",
            "intensity": "low"
        },
        {
            "id": "hope_share_excited",
            "title": "Share Something You're Excited About",
            "description": "Tell a friend about something you look forward to.",
            "duration": 3,
            "type": "Social",
            "intensity": "low"
        },
        {
            "id": "hope_affirm",
            "title": "Hopeful Affirmation",
            "description": "Write: 'I am moving toward…' and save it.",
            "duration": 2,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "hope_scripting",
            "title": "Success-Day Scripting",
            "description": "Describe the next successful day in 5 sentences.",
            "duration": 6,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "hope_research",
            "title": "10-min Micro Research",
            "description": "Learn one practical tip that supports your goal.",
            "duration": 10,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "hope_progress_log",
            "title": "Progress Log",
            "description": "List one recent win that supports your hope.",
            "duration": 3,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "hope_gratitude_progress",
            "title": "Gratitude for Progress",
            "description": "Name two small changes you are proud of.",
            "duration": 3,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "hope_commit_ritual",
            "title": "Commitment Ritual",
            "description": "Set a calendar reminder for your next step.",
            "duration": 2,
            "type": "Behavioral",
            "intensity": "low"
        },
    ],


    # ---------------------------------------------------------
    # GUILTY
    # ---------------------------------------------------------
    "Guilty": [
        {
            "id": "guilt_self_compassion",
            "title": "Self-Compassion Script",
            "description": "Write: 'I did my best with what I knew then.'",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "guilt_repair_step",
            "title": "Repair Checklist",
            "description": "List one small reparative action you can take.",
            "duration": 5,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "guilt_reframe",
            "title": "Perspective Reframer",
            "description": "What did I learn & what will I do differently?",
            "duration": 6,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "guilt_unsent_letter",
            "title": "Unsent Letter",
            "description": "Write an honest letter expressing how you feel.",
            "duration": 7,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "guilt_forgiveness",
            "title": "Self-Forgiveness Prompt",
            "description": "Write a sentence you’d accept from someone else.",
            "duration": 2,
            "type": "Cognitive",
            "intensity": "low"
        },
        {
            "id": "guilt_soothe_body",
            "title": "Hand-on-Heart Breathing",
            "description": "Physical soothing exercise to soften guilt.",
            "duration": 3,
            "type": "Calm",
            "intensity": "low"
        },
        {
            "id": "guilt_restitution",
            "title": "Behavioral Restitution",
            "description": "Do one helpful act today to restore balance.",
            "duration": 10,
            "type": "Behavioral",
            "intensity": "medium"
        },
        {
            "id": "guilt_cognitive_check",
            "title": "Is My Guilt Proportionate?",
            "description": "List evidence for & against your guilt.",
            "duration": 8,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "guilt_talk_peer",
            "title": "Talk to a Trusted Peer",
            "description": "Share openly for perspective & support.",
            "duration": 15,
            "type": "Social",
            "intensity": "medium"
        },
        {
            "id": "guilt_prevention_plan",
            "title": "Plan to Prevent Recurrence",
            "description": "Design one concrete change.",
            "duration": 6,
            "type": "ProblemSolve",
            "intensity": "medium"
        },
    ],


    # ---------------------------------------------------------
    # CONFLICTED
    # ---------------------------------------------------------
    "Conflicted": [
        {
            "id": "conflict_pros_cons",
            "title": "Pros & Cons Table",
            "description": "List 3 pros and 3 cons for each option.",
            "duration": 7,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "conflict_values_check",
            "title": "Values Check",
            "description": "Identify which option aligns with your values.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "conflict_time_test",
            "title": "Time-Limited Experiment",
            "description": "Try option A for 24 hours (planning step).",
            "duration": 2,
            "type": "Behavioral",
            "intensity": "low"
        },
        {
            "id": "conflict_voice_note",
            "title": "Talk-It-Out Voice Note",
            "description": "Record a 2-minute pros/cons discussion.",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "conflict_friend_advice",
            "title": "Advice to a Friend",
            "description": "What would you say if a friend had this dilemma?",
            "duration": 4,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "conflict_future_projection",
            "title": "Future Projection",
            "description": "Imagine both outcomes in one month.",
            "duration": 5,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "conflict_small_step",
            "title": "Reversible Step",
            "description": "Choose one small low-commitment action.",
            "duration": 3,
            "type": "Behavioral",
            "intensity": "low"
        },
        {
            "id": "conflict_list_worries",
            "title": "List Worries vs Benefits",
            "description": "Separate fears & benefits clearly.",
            "duration": 6,
            "type": "Cognitive",
            "intensity": "medium"
        },
        {
            "id": "conflict_sleep",
            "title": "Sleep On It",
            "description": "Set a reminder to revisit after rest.",
            "duration": 1,
            "type": "Behavioral",
            "intensity": "low"
        },
        {
            "id": "conflict_third_view",
            "title": "Ask a Trusted Person",
            "description": "Get a perspective from someone neutral.",
            "duration": 6,
            "type": "Social",
            "intensity": "medium"
        },
    ],
}



def pick_tasks(emotion: str, count: int = 3):
    """
    Selects 'count' random tasks for the given emotion.
    If emotion not found → fallback to Happy tasks.
    """
    tasks = EMOTION_TASKS.get(emotion, EMOTION_TASKS["Happy"])

    selected = random.sample(tasks, min(count, len(tasks)))

    # Add expiry time: 30 minutes from now
    expires_at = (datetime.utcnow() + timedelta(minutes=30)).isoformat()

    for t in selected:
        t["expires_at"] = expires_at
        t["status"] = "pending"

    return selected