from fastapi import Request, HTTPException, status
from app.core.security import decode_token

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise Exception()

        payload = decode_token(token)
        return payload
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

def require_role(required_role: str):
    def role_checker(user=...):
        if user["role"] != required_role:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return role_checker