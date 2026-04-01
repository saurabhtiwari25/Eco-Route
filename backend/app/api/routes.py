from fastapi import APIRouter
from app.db.mongodb import db


router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/db-check")
def db_check():
    collections = db.list_collection_names()
    return {"collections": collections}