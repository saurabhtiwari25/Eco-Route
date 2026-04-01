from fastapi import APIRouter, Depends, HTTPException
from app.schemas.driver import DriverCreate
from app.services.driver_service import (
    create_driver_service,
    get_drivers_service
)
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/drivers", tags=["drivers"])

def admin_only(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user

@router.post("/", dependencies=[Depends(admin_only)])
def create_driver(driver: DriverCreate):
    return create_driver_service(driver.dict())

@router.get("/", dependencies=[Depends(admin_only)])
def get_drivers():
    return get_drivers_service()