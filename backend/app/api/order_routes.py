from fastapi import APIRouter, Depends, HTTPException
from app.schemas.order import OrderCreate, OrderUpdate
from app.services.order_service import (
    create_order_service,
    get_orders_service,
    update_order_service
)
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])

def admin_only(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user

@router.post("/", dependencies=[Depends(admin_only)])
def create_order(order: OrderCreate):
    return create_order_service(order.dict())

@router.get("/", dependencies=[Depends(admin_only)])
def get_orders():
    return get_orders_service()

@router.put("/{order_id}", dependencies=[Depends(admin_only)])
def update_order(order_id: str, order: OrderUpdate):
    return update_order_service(order_id, order.dict(exclude_none=True))