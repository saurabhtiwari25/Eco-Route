from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.simulation_service import simulate_route

router = APIRouter()

@router.websocket("/ws/simulate")
async def simulate(websocket: WebSocket):
    await websocket.accept()

    try:
        data = await websocket.receive_json()
        routes = data.get("routes", [])

        for r in routes:
            start = r.get("start_location")
            route = r.get("route", [])

            for step in simulate_route(route, start):
                await websocket.send_json({
                    "driver_index": r.get("driver_index"),
                    **step
                })

    except WebSocketDisconnect:
        pass