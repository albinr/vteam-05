"""
bike.py

This module defines a Bike class to simulate the behavior and state of an electric bike 
in a system for renting bikes.
"""

import asyncio
import random
import uuid
from datetime import datetime
import requests

# Constants
SLEEP_TIME = 1  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 5  # Seconds for sending updates to API

MIN_TRAVEL_TIME = 0.1 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 0.5 # Minutes of maximum travel time for simulation

API_URL="http://backend:1337"

BIKE_ID = uuid.uuid4()

class Bike: # pylint: disable=too-many-instance-attributes
    """
    Bike class for simulating an electric bike.
    """
    def __init__( # pylint: disable=too-many-arguments too-many-positional-arguments too-many-instance-attributes
            self,
            bike_id,
            battery=100,
            min_battery=20,
            status="available", # 'available', 'in_use', 'maintenance', 'charging'
            location=(0, 0),
            simulated=False
            ):

        self.bike_id = bike_id
        self.battery = battery
        self.min_battery = min_battery
        self.location = location
        self.update_delay = random.uniform(0, 4)
        self.status = status  # locked, unlocked, idle, charging, shutdown
        self.simulated = simulated  # To mark if the bike is simulated
        self.added_to_db = False
        self.add_to_db_tries = 0

        while not self.added_to_db and self.add_to_db_tries < 3:
            self.add_bike_to_system()

    def add_bike_to_system(self):
        """Add the bike to the system."""
        # Check if already added to database
        try:
            requests.post(f"{API_URL}/v1/add_bike", timeout=30, data={
                "bikeId": self.bike_id,
                "batteryLevel": self.battery,
                "longitude": self.location[0],
                "latitude": self.location[1],
                "isSimulated": 1 if self.simulated else 0
            })
            print(f"Added bike {self.bike_id} to database.")
            self.added_to_db = True
        except requests.exceptions.RequestException as e:
            print(f"Error adding bike to database: {e}")
            self.add_to_db_tries += 1

    async def send_update_to_api(self):
        """Send periodic updates to the API."""

        # Random delay to avoid all bikes updating at the same time
        await asyncio.sleep(self.update_delay)

        while self.status != "shutdown":
            if self.battery < self.min_battery:
                print(f"[Bike {self.bike_id:2}] Battery low! Sending alert to API.")
                # Send alert to API
                # /api/bike-low-battery?
            data = self.get_data()
            print(f"[Bike {self.bike_id:2}] Sending data to API: {data}")
            try:
                requests.put(f"{API_URL}/v1/bikes/{self.bike_id}",
                            timeout=API_UPDATE_INTERVAL - API_UPDATE_INTERVAL * 0.9, data={
                    "battery_level": self.battery,
                    "status": self.status,
                    "longitude": self.location[0],
                    "latitude": self.location[1],
                    # "battery_danger": self.battery < self.min_battery
                })
            except requests.exceptions.RequestException as e:
                print(f"Error sending data to API: {e}")
            await asyncio.sleep(API_UPDATE_INTERVAL)

    def get_data(self):
        """Return the current data of the bike."""
        return {
            "bike_id": f"{self.bike_id:2}",
            "battery": f"{self.battery:6.2f}",
            "location": self.location,
            "status": f"{self.status:10}",
            "timestamp": datetime.now().isoformat()
        }

    async def update_bike_data(self, status=None, location=None, battery=None):
        """Method to dynamically update bike data (status, location, battery)."""
        print("[Bike] Updating bike data...")
        if status:
            self.status = status
        if location:
            self.location = location
        if battery:
            self.battery = battery

    async def run_bike_interval(self):
        """Start the update loop for sending data and battery drain."""
        # Run all tasks in the background
        if self.simulated:
            battery_task = asyncio.create_task(self.sim_battery())
            travel_task = asyncio.create_task(self.sim_travel())
            status_task = asyncio.create_task(self.sim_random_bike_status())
            update_task = asyncio.create_task(self.send_update_to_api())

            await asyncio.gather(update_task, battery_task, status_task, travel_task)
        else:
            update_task = asyncio.create_task(self.send_update_to_api())
            await asyncio.gather(update_task)

        # Wait for all tasks to finish (running in background)

    async def sim_battery(self):
        """Simulate battery drain when bike is unlocked."""
        while self.status != "shutdown":
            if self.status == "in_use":
                # Simulate battery drain
                self.battery -= random.uniform(0.01, 0.05)
            if self.status == "charging" and self.battery < 100:
                # Simulate battery charging
                self.battery += random.uniform(0.01, 0.05)

                # Make sure that the battery doesn't go over 100
                if self.battery > 100: # pylint: disable=consider-using-min-builtin
                    self.battery = 100

            await asyncio.sleep(SLEEP_TIME)

    async def sim_travel(self):
        """Simulate bike travel."""
        while self.status != "shutdown":
            if self.status == "in_use" and self.battery > 0:
                # Simulate travel
                self.location = (self.location[0] + random.uniform(-0.005, 0.005),
                                self.location[1] + random.uniform(-0.005, 0.005))
                print(f"[Bike {self.bike_id}] Traveling to: {self.location}")
            await asyncio.sleep(SLEEP_TIME)


    async def sim_random_bike_status(self):
        """ Randomly change the bike status."""
        while self.status != "shutdown":
            self.status = random.choice(['available', 'in_use', 'maintenance', 'charging'])
            print(f"[Bike {self.bike_id}] Status changed to: {self.status}")

            # Change status every X-Y minutes
            await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME))


if __name__ == "__main__":
    # Create a bike object
    bike = Bike(BIKE_ID)
    asyncio.run(bike.run_bike_interval())
