"""
simulation.py

This module defines a Simulation class to create simulated bikes and users.
"""

import asyncio
import uuid
import atexit
import requests
from bike import Bike

API_URL="http://backend:1337"

class Simulation:
    """
    Simulation class for starting a simulation with simulated bikes
    """
    def __init__(self, num_bikes=1, simulated=True):
        self.bikes = [
                        Bike(bike_id=f"{uuid.uuid4()}",
                        location=(56.176, 15.590), simulated=simulated)
                        for _ in range(1, num_bikes + 1)
                    ]
        self.state = "initialized"

    def list_bikes(self):
        """List all bikes and their data."""
        print("[Simulation] Current Bikes:")
        for bike in self.bikes:
            print(
                f"Bike ID: {bike.bike_id},"
                f" Battery: {bike.battery}, "
                f"Status: {bike.status}, "
                f"Location: {bike.location}")

    async def start_bikes(self):
        """Start the bike update and interval loop."""
        tasks = [bike.run_bike_interval() for bike in self.bikes]

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

def on_exit():
    """Stop the simulation on exit and deletes simulated items from database."""
    requests.delete(f"{API_URL}/v1/bikes/1", timeout=30)

    print("Simulation has stopped.")

atexit.register(on_exit)

if __name__ == "__main__":
    # Create a simulation with X bikes
    simulation = Simulation(num_bikes=100)

    async def main():
        """
        To test the file
        """
        # Start the simulation in a background task
        simulation_task = asyncio.create_task(simulation.start())

        # Update bike 2's battery level
        # await simulation.update_bike_data(bike_id=1, battery=50)

        # Ensure thath the simulation completes
        await simulation_task

    # Run the async main function
    asyncio.run(main())
