from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth_middleware import get_current_user
from app.services.incremental_service import run_partial_optimization
from pydantic import BaseModel
from typing import List


class NewOrderRequest(BaseModel):
    location: List[float]
    priority: int
    time_window: List[int]


router = APIRouter(prefix="/optimize/partial", tags=["optimization"])


def admin_only(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user


@router.post("/", dependencies=[Depends(admin_only)])
def partial_optimize(req: NewOrderRequest):
    return run_partial_optimization(req.dict())