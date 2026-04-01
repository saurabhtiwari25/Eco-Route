from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.api.auth_routes import router as auth_router
from app.api.order_routes import router as order_router
from app.api.driver_routes import router as driver_router
from app.api.optimization_routes import router as optimization_router
from app.api.simulation_ws import router as simulation_ws_router
from app.api.incremental_routes import router as incremental_router

app = FastAPI()

# ✅ ADD THIS BLOCK
origins = [
    "http://localhost:5173",  # frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ THEN include routers
app.include_router(router)
app.include_router(auth_router)
app.include_router(order_router)
app.include_router(driver_router)
app.include_router(optimization_router)
app.include_router(simulation_ws_router)
app.include_router(incremental_router)


@app.get("/")
def root():
    return {"message": "Logistics API running"}