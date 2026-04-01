from app.db.mongodb import db

collection = db["users"]

def create_user(user: dict):
    return collection.insert_one(user)

def find_user_by_email(email: str):
    return collection.find_one({"email": email})

def find_user_by_id(user_id):
    return collection.find_one({"_id": user_id})