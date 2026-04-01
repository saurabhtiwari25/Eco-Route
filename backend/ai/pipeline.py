import math
from typing import List, Dict, Tuple


class OptimizationPipeline:
    def __init__(self, drivers: List[Dict], orders: List[Dict], speed_kmh: float = 40.0):
        self.drivers = drivers
        self.orders = orders
        self.speed_kmh = speed_kmh

    # ---------------- Haversine ----------------
    def haversine(self, p1: List[float], p2: List[float]) -> float:
        lat1, lon1 = p1
        lat2, lon2 = p2

        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (
            math.sin(dlat / 2) ** 2 +
            math.cos(math.radians(lat1)) *
            math.cos(math.radians(lat2)) *
            math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    # ---------------- K-Means (Deterministic) ----------------
    def kmeans(self):
        k = len(self.drivers)

        # Initialize centroids from driver start locations
        centroids = [d["start_location"] for d in self.drivers]

        assignments = [[] for _ in range(k)]

        for _ in range(10):  # fixed iterations (deterministic)
            assignments = [[] for _ in range(k)]
            capacities = [d["capacity"] for d in self.drivers]

            for order in sorted(self.orders, key=lambda x: -x["priority"]):
                best_idx = None
                best_dist = float("inf")

                for i, centroid in enumerate(centroids):
                    if len(assignments[i]) >= capacities[i]:
                        continue
                    dist = self.haversine(order["location"], centroid)
                    if dist < best_dist:
                        best_dist = dist
                        best_idx = i

                if best_idx is not None:
                    assignments[best_idx].append(order)

            # recompute centroids
            new_centroids = []
            for cluster in assignments:
                if not cluster:
                    new_centroids.append([0.0, 0.0])
                    continue
                lat = sum(o["location"][0] for o in cluster) / len(cluster)
                lng = sum(o["location"][1] for o in cluster) / len(cluster)
                new_centroids.append([lat, lng])

            centroids = new_centroids

        return assignments

    # ---------------- Distance ----------------
    def route_distance(self, start: List[float], route: List[Dict]) -> float:
        total = 0.0
        current = start

        for order in route:
            total += self.haversine(current, order["location"])
            current = order["location"]

        return total

    # ---------------- Nearest Neighbor ----------------
    def nearest_neighbor(self, start: List[float], orders: List[Dict]) -> List[Dict]:
        remaining = orders[:]
        route = []
        current = start

        while remaining:
            nearest = min(
                remaining,
                key=lambda o: self.haversine(current, o["location"])
            )
            route.append(nearest)
            remaining.remove(nearest)
            current = nearest["location"]

        return route

    # ---------------- 2-opt ----------------
    def two_opt(self, start: List[float], route: List[Dict]) -> List[Dict]:
        best = route[:]
        improved = True

        while improved:
            improved = False
            best_distance = self.route_distance(start, best)

            for i in range(len(best) - 1):
                for j in range(i + 1, len(best)):
                    if j - i == 1:
                        continue

                    new_route = best[:]
                    new_route[i:j] = reversed(best[i:j])

                    new_distance = self.route_distance(start, new_route)

                    if new_distance < best_distance:
                        best = new_route
                        improved = True
                        break
                if improved:
                    break

        return best

    # ---------------- ETA ----------------
    def compute_eta(self, distance_km: float) -> float:
        return distance_km / self.speed_kmh * 60.0  # minutes

    # ---------------- Pipeline ----------------
    def run(self):
        clusters = self.kmeans()

        results = []
        total_before = 0.0
        total_after = 0.0

        for i, cluster in enumerate(clusters):
            driver = self.drivers[i]
            start = driver["start_location"]

            if not cluster:
                results.append({
                    "driver_index": i,
                    "route": [],
                    "before_distance": 0.0,
                    "after_distance": 0.0,
                    "eta_minutes": 0.0
                })
                continue

            # Before optimization (given order)
            before_distance = self.route_distance(start, cluster)

            # Nearest Neighbor
            nn_route = self.nearest_neighbor(start, cluster)

            # 2-opt
            optimized_route = self.two_opt(start, nn_route)

            after_distance = self.route_distance(start, optimized_route)

            eta = self.compute_eta(after_distance)

            total_before += before_distance
            total_after += after_distance

            results.append({
                "driver_index": i,
                "route": optimized_route,
                "before_distance": before_distance,
                "after_distance": after_distance,
                "eta_minutes": eta
            })

        efficiency_gain = 0.0
        if total_before > 0:
            efficiency_gain = (total_before - total_after) / total_before

        return {
            "routes": results,
            "metrics": {
                "before_distance": total_before,
                "after_distance": total_after,
                "efficiency_gain": efficiency_gain
            }
        }