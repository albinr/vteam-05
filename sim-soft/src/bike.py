import asyncio
import random
from datetime import datetime

# Constants
SLEEP_TIME = 1  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 5  # Seconds for sending updates to API

MIN_TRAVEL_TIME = 0.1 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 0.5 # Minutes of maximum travel time for simulation

class Bike:
    def __init__(self, bike_id, battery=100, min_battery=20, status="locked", location=(0, 0), simulated=True):
        self.bike_id = bike_id
        self.battery = battery
        self.min_battery = min_battery
        self.location = location
        self.update_delay = random.uniform(0, 4)
        self.status = status  # locked, unlocked, idle, charging
        self.simulated = simulated  # To mark if the bike is simulated

    async def send_update_to_api(self):
        """Send periodic updates to the API."""
        await asyncio.sleep(self.update_delay) # Random delay to avoid all bikes updating at the same time

        while self.battery > 0:
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

    async def sim_battery(self):
        """Simulate battery drain when bike is unlocked."""
        while self.battery > 0:
            if self.status == "unlocked":
                # Simulate battery drain
                # self.battery -= random.uniform(0.01, 0.05)
                self.battery = 0
            if self.status == "charging" and self.battery < 100:
                # Simulate battery charging
                self.battery += random.uniform(0.01, 0.05)

                # Make sure that the battery doesn't go over 100
                if self.battery > 100:
                    self.battery = 100

            await asyncio.sleep(SLEEP_TIME)

    async def sim_travel(self):
        """Simulate bike travel."""
        while self.battery > 0:
            if self.status == "unlocked":
                # Simulate travel
                self.location = (self.location[0] + random.uniform(-0.005, 0.005),
                                self.location[1] + random.uniform(-0.005, 0.005))
                print(f"[Bike {self.bike_id}] Traveling to: {self.location}")
            await asyncio.sleep(SLEEP_TIME)

    async def sim_random_bike_status(self):
        """ Randomly change the bike status."""
        while self.battery > 0:
            self.status = random.choice(["locked", "unlocked", "idle", "charging"])
            print(f"[Bike {self.bike_id}] Status changed to: {self.status}")
            await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME)) # Change status every X-Y minutes

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
