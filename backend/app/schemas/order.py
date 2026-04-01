from pydantic import BaseModel
from typing import List

class OrderCreate(BaseModel):
    location: List[float]
    priority: int
    time_window: List[int]

class OrderUpdate(BaseModel):
    location: List[float] | None = None
    priority: int | None = None
    time_window: List[int] | None = None