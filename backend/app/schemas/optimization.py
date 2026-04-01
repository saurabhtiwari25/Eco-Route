from pydantic import BaseModel
from typing import List, Dict, Any

class OptimizationRequest(BaseModel):
    drivers: List[Dict[str, Any]]
    orders: List[Dict[str, Any]]