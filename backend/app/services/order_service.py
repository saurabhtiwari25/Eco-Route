from app.models.order import create_order, get_all_orders, update_order

def create_order_service(data: dict):
    create_order(data)
    return {"message": "Order created"}

def get_orders_service():
    return get_all_orders()

def update_order_service(order_id: str, data: dict):
    update_order(order_id, data)
    return {"message": "Order updated"}