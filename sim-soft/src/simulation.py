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
import random
from bike import Bike
from user import User

API_URL="http://backend:1337"

FETCH_INTERVAL = 20
USER_RENT_PORTION = 1 // 6 

class Simulation:
    """
    Simulation class for starting a simulation with simulated bikes
    """
    def __init__(self, num_bikes=1, simulated=True):
        on_exit()

        # self.bikes = [
        #                 Bike(bike_id=f"{uuid.uuid4()}",
        #                 location=(56.176, 15.590), simulated=simulated)
        #                 for _ in range(1, num_bikes + 1)
        # ]

        self.state = "initialized"
        self.zones = []
        self.cities = []
        self.bikes = []
        self.fetchedBikes = {}
        self.num_bikes = num_bikes
        self.simulated = simulated

        self.fetch_zones()

        self.add_start_bike(num_bikes=num_bikes, simulated = simulated)

        self.users = [
            User(user_id=f"{i}", username=f"user{i}", email=f"user{i}@gmail.com")
            for i in range(1, num_bikes + 1)
        ]

        self.distribute_bikes()

    def add_start_bike(self, num_bikes=1, simulated=False):
        """
        Add a bike to the simulation.
        """
        for _ in range(1, num_bikes + 1):
            # Get random city to start bike in
            random_city = self.cities[random.randint(0, len(self.cities) - 1)]

            # Get random zone in city
            random_zone_int = random.randint(0, len(self.zones[random_city]) - 1)
            bike_latitude = self.zones[random_city][random_zone_int]["latitude"]
            bike_longitude = self.zones[random_city][random_zone_int]["longitude"]

            # Add bike to simulation
            new_bike = Bike(bike_id=f"{uuid.uuid4()}",
                location=(bike_longitude, bike_latitude), simulated=simulated)
            self.bikes.append(new_bike)

    async def initialize_bikes(self):
        print("Initializing bikes...")
        for bike in self.bikes:
            await bike.initialize()

    def fetch_zones(self):
        """
        Fetch all zones
        """
        try:
            zones = requests.get(f"{API_URL}/v2/zones", timeout=30).json()

            zone_cities = {}

            for zone in zones:
                if zone["city"] not in zone_cities:
                    zone_cities[zone["city"]] = []
                    self.cities.append(zone["city"])

                zone_cities[zone["city"]].append(zone)

            self.zones = zone_cities
            return zones
        except requests.exceptions.RequestException as e:
            print(f"Error getting zones: {e}")
            return e

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
                bikesData = requests.get(f"{API_URL}/v2/bikes", timeout=30)
                if bikesData.status_code != 200:
                    # Throw error
                    raise requests.exceptions.RequestException(f"Error getting bikes: {bikesData.status_code}")

                self.fetchedBikes = bikesData.json()

                for user in self.users:
                    user.update_bikes(self.fetchedBikes)

            except requests.exceptions.RequestException as e:
                    print(f"Error getting bikes: {bikesData.status_code}")

            await asyncio.sleep(FETCH_INTERVAL)

    def distribute_bikes(self):
        """
        Distrubute bikes to users.
        """
        for user in self.users[:len(self.users) * USER_RENT_PORTION]:
            for bike in self.bikes:
                if user.bike:
                    break

                if not bike.user_owner:
                    # bike.status = "in_use"
                    bike.user_owner = user.user_id
                    user.bike = bike.bike_id
                    break

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
        # Remove simulated trips
        requests.delete(f"{API_URL}/v2/trips/1", timeout=30)
    except requests.exceptions.RequestException as e:
        print(f"Error deleting trip data: {e}")

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
    simulation = Simulation(num_bikes=3000)

    async def main():
        """
        To test the file
        """
        await simulation.initialize_bikes()
        # Start the simulation in a background task
        simulation_task = asyncio.create_task(simulation.start())
        # simulation.fetchZones()


        # Update bike 2's battery level
        # await simulation.update_bike_data(bike_id=1, battery=50)

        # Ensure thath the simulation completes
        await simulation_task

    # Run the async main function
    asyncio.run(main())