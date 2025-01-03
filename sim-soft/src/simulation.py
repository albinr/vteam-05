"""
simulation.py

This module defines a Simulation class to create simulated bikes and users.
"""

import asyncio
import uuid
import atexit
import requests
import signal
import sys
from bike import Bike
from user import User

API_URL="http://backend:1337"

FETCH_INTERVAL = 5

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

        self.users = [
            User(user_id=f"{i}", username=f"user{i}", email=f"user{i}@gmail.com")
            for i in range(1, num_bikes + 1)
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
        bike_tasks = [bike.run_bike_interval() for bike in self.bikes]
        user_tasks = [user.run_user_interval() for user in self.users]

        get_bikes_task = asyncio.create_task(self.get_bikes())

        await asyncio.gather(*bike_tasks, *user_tasks, get_bikes_task)

    async def get_bikes(self):
        """
        Get all bikes from the API.
        """
        while True:
            try:
                bikes = requests.get(f"{API_URL}/v2/bikes", timeout=30)
                if bikes.status_code != 200:
                    # Throw error
                    raise requests.exceptions.RequestException(f"Error getting bikes: {bikes.status_code}")

                self.bikes = bikes.json()

                print("Sending bikes to users...")

                for user in self.users:
                    user.update_bikes(self.bikes)

            except requests.exceptions.RequestException as e:
                    print(f"Error getting bikes: {bikes.status_code}")

            await asyncio.sleep(FETCH_INTERVAL)


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
    try:
        requests.delete(f"{API_URL}/v2/bikes/all/1", timeout=30)
        print(f"Simulated bikes deleted from database!")
    except requests.exceptions.RequestException as e:
        print(f"Error deleting bike data: {e}")

    try:
        # Remove simulated users
        requests.delete(f"{API_URL}/v2/users/1", timeout=30)
        print(f"Simulated users deleted from database!")
    except requests.exceptions.RequestException as e:
        print(f"Error deleting users: {e}")

    print("Simulation has stopped.")

def handle_signal():
    on_exit()
    sys.exit(0)

atexit.register(on_exit)
signal.signal(signal.SIGINT, handle_signal)
signal.signal(signal.SIGTERM, handle_signal)


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