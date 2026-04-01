from app.db.mongodb import db

collection = db["assignments"]

def create_assignment(data: dict):
    return collection.insert_one(data)