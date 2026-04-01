from fastapi import APIRouter, HTTPException
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(req: RegisterRequest):
    try:
        return register_user(req.email, req.password, req.role)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    try:
        return login_user(req.email, req.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))