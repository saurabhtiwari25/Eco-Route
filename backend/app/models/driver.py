from app.db.mongodb import db
from bson import ObjectId

collection = db["drivers"]

def create_driver(driver: dict):
    return collection.insert_one(driver)

def get_all_drivers():
    drivers = list(collection.find())
    for d in drivers:
        d["_id"] = str(d["_id"])
    return drivers