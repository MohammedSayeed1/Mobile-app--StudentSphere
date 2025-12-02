import os
from pymongo import MongoClient
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
FERNET_KEY = os.getenv("FERNET_KEY")

if not FERNET_KEY:
    raise RuntimeError("❌ FERNET_KEY missing in .env")

# Initialize Fernet
fernet = Fernet(FERNET_KEY.encode())

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.get_default_database()
journals = db.journals

# Loop through all journal documents
for doc in journals.find({}):
    changed = False
    entries = doc.get("entries", [])

    for e in entries:
        txt = e.get("text")
        # Skip if already encrypted (Fernet tokens start with "gAAAA")
        if txt and not txt.startswith("gAAAA"):
            print(f"Encrypting entry for user: {doc.get('username')}, date: {e.get('date')}")
            e["text"] = fernet.encrypt(txt.encode()).decode()
            changed = True

    if changed:
        journals.update_one({"_id": doc["_id"]}, {"$set": {"entries": entries}})
        print(f"✅ Updated document for user: {doc.get('username')}")
