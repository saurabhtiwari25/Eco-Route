from app.models.driver import create_driver, get_all_drivers

def create_driver_service(data: dict):
    create_driver(data)
    return {"message": "Driver created"}

def get_drivers_service():
    return get_all_drivers()