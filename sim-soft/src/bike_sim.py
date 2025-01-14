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

import bike

# Constants
SLEEP_TIME = 1  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 5  # Seconds for sending updates to API

MIN_TRAVEL_TIME = 0.1 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 0.5 # Minutes of maximum travel time for simulation

MIN_BATTERY = 30

API_URL="http://backend:1337"


class SimBike(bike.Bike):
    def __init__(
            self,
            bike_id,
            battery=100,
            min_battery=20,
            status="available",
            location=(0, 0),
            speed=0,
            speed_limit=20,
            simulated=False,
            zones = {},
        ):
        super().__init__(bike_id, battery, min_battery, status, location, speed, speed_limit, simulated)

        self.update_delay = random.uniform(0, 4)
        self.status = status  # 'available', 'in_use', 'maintenance', 'charging'
        self.simulated = simulated  # To mark if the bike is simulated
        self.added_to_db = False
        self.add_to_db_tries = 0
        self.user_owner = None
        self.zones = zones
        self.target_zone = None

        while not self.added_to_db and self.add_to_db_tries < 3:
            self.add_bike_to_system()

    def add_bike_to_system(self):
        """Add the bike to the system."""
        # Check if already added to database
        try:
            res = requests.post(f"{API_URL}/v2/bikes/add", timeout=30, data={
                "bikeId": self.bike_id,
                "batteryLevel": self.battery,
                "longitude": self.location[0],
                "latitude": self.location[1],
                "isSimulated": 1 if self.simulated else 0
            })

            if res.status_code != 200:
                raise requests.exceptions.RequestException(f"Error adding bike to database: {res.status_code}")

            print(f"Added bike {self.bike_id} to database.")
            self.added_to_db = True
        except requests.exceptions.RequestException as e:
            print(f"Error adding bike to database: {e}")


    async def run_bike_interval(self):
        """Start the update loop for sending data and battery drain."""
        # Run all tasks in the background
        if self.simulated:
            battery_task = asyncio.create_task(self.sim_battery())
            travel_task = asyncio.create_task(self.sim_travel())
            # status_task = asyncio.create_task(self.sim_random_bike_status())
            update_task = asyncio.create_task(self.send_update_to_api())

            # await asyncio.gather(update_task, battery_task, status_task, travel_task)
            await asyncio.gather(update_task, battery_task, travel_task)

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
        pass


if __name__ == "__main__":
    # Create a bike object
    bike = SimBike(bike_id=uuid.uuid4(), simulated=True)
    asyncio.run(bike.run_bike_interval())
