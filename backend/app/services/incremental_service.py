from app.models.assignment import collection as assignment_collection
from app.models.driver import get_all_drivers
from ai.incremental import IncrementalOptimizer

def run_partial_optimization(new_order: dict):
    # get latest assignment
    latest = assignment_collection.find_one(sort=[("_id", -1)])
    if not latest:
        raise ValueError("No existing assignments")

    drivers = get_all_drivers()
    routes = latest["routes"]

    optimizer = IncrementalOptimizer(drivers, routes, new_order)
    result = optimizer.run()

    assignment_collection.insert_one(result)

    return result