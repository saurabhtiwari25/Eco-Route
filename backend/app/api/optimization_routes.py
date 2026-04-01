from fastapi import APIRouter, Depends, HTTPException
from app.schemas.optimization import OptimizationRequest
from app.services.optimization_service import run_optimization
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/optimize", tags=["optimization"])

def admin_only(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user

@router.post("/", dependencies=[Depends(admin_only)])
def optimize(req: OptimizationRequest):
    return run_optimization(req.drivers, req.orders)