"""
bike.py

This module defines a Bike class to simulate the behavior and state of an electric bike
in a system for renting bikes.
"""

import asyncio
import random
import uuid
import json
from datetime import datetime
from socketio import AsyncClient
from bike import Bike

# Constants
SLEEP_TIME_IN_USE = 5
SLEEP_TIME_IDLE = 60

SLEEP_TIME = 10  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 11  # Seconds for sending updates to API

MIN_TRAVEL_TIME = 5 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 10 # Minutes of maximum travel time for simulation

API_URL="http://backend:1337"
WEBSOCKET_URL="http://backend:1337"

BIKE_ID = uuid.uuid4()

class SimBike(Bike): # pylint: disable=too-many-instance-attributes
    """
    Bike class for simulating an electric bike.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.simulated = True

    async def run_bike_interval(self):
        """Start the update loop for sending data and battery drain."""
        # Run all tasks in the background

        if not self.sio.connected:  # Connect only if not already connected
            return

        if self.simulated:
            battery_task = asyncio.create_task(self.sim_battery())
            travel_task = asyncio.create_task(self.sim_travel())
            status_task = asyncio.create_task(self.sim_random_bike_status())
            update_task = asyncio.create_task(self.send_updates_interval_to_socketio())

            await asyncio.gather(battery_task, travel_task, status_task, update_task)


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

            # await self.send_update_to_socketio()

            await asyncio.sleep(SLEEP_TIME)

    async def sim_travel(self):
        """Simulate bike travel."""
        # await asyncio.sleep(random.randint(10, SLEEP_TIME_IN_USE * 10) / 10)
        while self.status != "shutdown":
            if self.status == "in_use" and self.battery > 0:
                await asyncio.sleep(SLEEP_TIME_IN_USE)
                # Simulate movement
                random_x = random.uniform(-0.005, 0.005)
                random_y = random.uniform(-0.005, 0.005)
                self.location = (
                    self.location[0] + random_x,
                    self.location[1] + random_y
                )

                # Simulate speed (km/h)
                distance = (random_x ** 2 + random_y ** 2) ** 0.5
                self.speed = distance / SLEEP_TIME_IN_USE * 3600  # Convert to km/h
                if self.speed > self.speed_limit:
                    self.speed = self.speed_limit

                # Send an update more frequently while in use
                # await self.send_update_to_socketio()
            else:
                await asyncio.sleep(SLEEP_TIME_IDLE)
                # Bike is not in use: set speed = 0, optionally no movement
                self.speed = 0
                # If you want a "heartbeat" update so admins see it's still online:
                # await self.send_update_to_socketio()
                # Sleep longer if idle to reduce load


    async def sim_random_bike_status(self):
        """ Randomly change the bike status."""
        while self.status != "shutdown":
            # self.status = random.choice(['available',
            #                             'available',
            #                             'available',
            #                             'charging',
            #                             'charging',
            #                             'maintenance'])
            # self.status = random.choice(['in_use',
            #                 'in_use',
            #                 'available',
            #                 'charging',
            #                 'charging',
            #                 'maintenance'])
            # self.status = "in_use"
            # print(f"[Bike {self.bike_id}] Status changed to: {self.status}")

            # Change status every X-Y minutes
            await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME))


if __name__ == "__main__":
    bike1 = SimBike(BIKE_ID, simulated=True)
    # bike2 = Bike(uuid.uuid4(), simulated=True)
    # bike3 = Bike(uuid.uuid4(), simulated=True)
    # bike4 = Bike(uuid.uuid4(), simulated=True)
    # bike5 = Bike(uuid.uuid4(), simulated=True)

    async def main():
        await bike1.initialize()  # Initialize bike asynchronously

        await asyncio.gather(
            bike1.run_bike_interval(),
            # bike2.run_bike_interval(),
            # bike3.run_bike_interval(),
            # bike4.run_bike_interval(),
            # bike5.run_bike_interval(),
            # Add other bikes here if needed
        )

    # Run the main coroutine
    asyncio.run(main())