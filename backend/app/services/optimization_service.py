from ai.pipeline import OptimizationPipeline
from app.models.assignment import create_assignment

def run_optimization(drivers, orders):
    pipeline = OptimizationPipeline(drivers, orders)
    result = pipeline.run()

    create_assignment(result)

    return result