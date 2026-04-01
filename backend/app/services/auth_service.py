from app.models.user import create_user, find_user_by_email 
from app.core.security import hash_password, verify_password, create_access_token

def register_user(email: str, password: str, role: str):
    existing = find_user_by_email(email)
    if existing:
        raise ValueError("User already exists")

    user = {
        "email": email,
        "password_hash": hash_password(password),
        "role": role
    }

    create_user(user)
    return {"message": "User created"}

def login_user(email: str, password: str):
    user = find_user_by_email(email)
    if not user:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user["password_hash"]):
        raise ValueError("Invalid credentials")

    token = create_access_token({
        "sub": user["email"],
        "role": user["role"]
    })

    return {"access_token": token}