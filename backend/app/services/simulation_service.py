import time
from typing import List, Dict, Generator
from math import radians, cos, sin, asin, sqrt

# reuse haversine-like distance (km)
def haversine(p1, p2):
    lat1, lon1 = p1
    lat2, lon2 = p2
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def interpolate(p1, p2, fraction):
    return [
        p1[0] + (p2[0] - p1[0]) * fraction,
        p1[1] + (p2[1] - p1[1]) * fraction
    ]

def simulate_route(route: List[Dict], start: List[float], speed_kmh: float = 40.0) -> Generator:
    path = [start] + [o["location"] for o in route]

    for i in range(len(path) - 1):
        p1 = path[i]
        p2 = path[i + 1]

        dist = haversine(p1, p2)
        if dist == 0:
            continue

        total_time_sec = (dist / speed_kmh) * 3600
        steps = max(int(total_time_sec // 1), 1)

        for step in range(steps + 1):
            frac = step / steps
            pos = interpolate(p1, p2, frac)

            yield {
                "position": pos,
                "segment_index": i,
                "progress": frac
            }

            time.sleep(1)