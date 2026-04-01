from app.db.mongodb import db
from bson import ObjectId

collection = db["orders"]

def create_order(order: dict):
    return collection.insert_one(order)

def get_all_orders():
    orders = list(collection.find())
    for o in orders:
        o["_id"] = str(o["_id"])
    return orders

def update_order(order_id: str, update_data: dict):
    return collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": update_data}
    )