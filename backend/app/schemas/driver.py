from pydantic import BaseModel
from typing import List

class DriverCreate(BaseModel):
    capacity: int
    start_location: List[float]