"""
bike.py

This module defines a Bike class to simulate the behavior and state of an electric bike 
in a system for renting bikes.
"""

import asyncio
import random
from datetime import datetime

# Constants
SLEEP_TIME = 1  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 5  # Seconds for sending updates to API

MIN_TRAVEL_TIME = 0.1 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 0.5 # Minutes of maximum travel time for simulation

class Bike:
    """
    Bike class for simulating an electric bike.
    """
    def __init__( # pylint: disable=too-many-arguments too-many-positional-arguments
            self,
            bike_id,
            battery=100,
            min_battery=20,
            status="locked",
            location=(0, 0),
            simulated=True
            ):

        self.bike_id = bike_id
        self.battery = battery
        self.min_battery = min_battery
        self.location = location
        self.update_delay = random.uniform(0, 4)
        self.status = status  # locked, unlocked, idle, charging, shutdown
        self.simulated = simulated  # To mark if the bike is simulated

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

    async def run_simulation(self):
        """Start the update loop for sending data and battery drain."""
        # Run all tasks in the background
        update_task = asyncio.create_task(self.send_update_to_api())
        battery_task = asyncio.create_task(self.sim_battery())
        status_task = asyncio.create_task(self.sim_random_bike_status())
        travel_task = asyncio.create_task(self.sim_travel())

        # Wait for all tasks to finish (running in background)
        await asyncio.gather(update_task, battery_task, status_task, travel_task)

    async def sim_battery(self):
        """Simulate battery drain when bike is unlocked."""
        while self.status != "shutdown":
            if self.status == "unlocked":
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
            if self.status == "unlocked" and self.battery > 0:
                # Simulate travel
                self.location = (self.location[0] + random.uniform(-0.005, 0.005),
                                self.location[1] + random.uniform(-0.005, 0.005))
                print(f"[Bike {self.bike_id}] Traveling to: {self.location}")
            await asyncio.sleep(SLEEP_TIME)


    async def sim_random_bike_status(self):
        """ Randomly change the bike status."""
        while self.status != "shutdown":
            self.status = random.choice(["locked", "unlocked", "idle", "charging"])
            print(f"[Bike {self.bike_id}] Status changed to: {self.status}")

            # Change status every X-Y minutes
            await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME))
