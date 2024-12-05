import asyncio
from src.bike import Bike

class Simulation:
    def __init__(self, num_bikes=1):
        self.bikes = [Bike(bike_id=i, location=(536432.5724638, 6224215.9292303)) for i in range(1, num_bikes + 1)]
        self.state = "initialized"

    def list_bikes(self):
        """List all bikes and their data."""
        print("[Simulation] Current Bikes:")
        for bike in self.bikes:
            print(f"Bike ID: {bike.bike_id}, Battery: {bike.battery}, Status: {bike.status}, Location: {bike.location}")

    async def start_bikes(self):
        """Start the bike update and simulation loop."""
        tasks = [bike.run_simulation() for bike in self.bikes]

        await asyncio.gather(*tasks)

    async def start(self):
        """Start the simulation and run bike updates."""
        print("[Simulation] Starting simulation...")
        self.state = "running"
        self.list_bikes()
        await self.start_bikes()

    async def update_bike_data(self, bike_id, status=None, location=None, battery=None):
        """Update specific bike data (status, location, or battery)."""
        for bike in self.bikes:
            if bike.bike_id == bike_id:
                await bike.update_bike_data(status, location, battery)

if __name__ == "__main__":
    # Create a simulation with X bikes
    simulation = Simulation(num_bikes=100)

    async def main():
        # Start the simulation in a background task
        simulation_task = asyncio.create_task(simulation.start())

        # Update bike 2's battery level
        # await simulation.update_bike_data(bike_id=1, battery=50)

        # Ensure thath the simulation completes
        await simulation_task

    # Run the async main function
    asyncio.run(main())
