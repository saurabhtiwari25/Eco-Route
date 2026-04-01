from typing import List, Dict
from ai.pipeline import OptimizationPipeline


class IncrementalOptimizer:
    def __init__(self, drivers: List[Dict], existing_routes: List[Dict], new_order: Dict):
        self.drivers = drivers
        self.routes = existing_routes
        self.new_order = new_order

    def _find_closest_driver(self) -> int:
        pipeline = OptimizationPipeline(self.drivers, [])
        best_idx = None
        best_dist = float("inf")

        for i, driver in enumerate(self.drivers):
            dist = pipeline.haversine(driver["start_location"], self.new_order["location"])
            if dist < best_dist:
                best_dist = dist
                best_idx = i

        return best_idx

    def run(self):
        target_idx = self._find_closest_driver()

        target_route = self.routes[target_idx]["route"]
        driver = self.drivers[target_idx]

        # append new order deterministically
        updated_orders = target_route + [self.new_order]

        # re-run ONLY for this cluster
        pipeline = OptimizationPipeline([driver], updated_orders)
        result = pipeline.run()["routes"][0]

        # merge back
        new_routes = self.routes[:]
        new_routes[target_idx] = result

        return {
            "routes": new_routes,
            "updated_driver_index": target_idx
        }