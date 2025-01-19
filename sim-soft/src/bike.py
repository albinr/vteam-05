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
import requests
# import websockets
from socketio import AsyncClient

# Constants
SLEEP_TIME_IN_USE = 5
SLEEP_TIME_IDLE = 60

SLEEP_TIME = 10  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 11  # Seconds for sending updates to API

MIN_TRAVEL_TIME = 5 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 10 # Minutes of maximum travel time for simulation

# API_URL="http://backend:1337"
# WEBSOCKET_URL="http://backend:1337"
API_URL="http://backend:1337"
WEBSOCKET_URL="http://backend:1337"

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
            speed=0,
            speed_limit=20,
            simulated=False,
            # red_led=False
            ):

        self.bike_id = bike_id
        self.battery = battery
        self.min_battery = min_battery
        self.location = location
        self.speed = speed
        self.speed_limit = speed_limit
        self.update_delay = random.uniform(0, 10)
        self.status = status  # 'available', 'in_use', 'maintenance', 'charging'
        self.simulated = simulated  # To mark if the bike is simulated
        self.user_owner = None
        self.sio = AsyncClient(reconnection=True,
                            reconnection_attempts=5,
                            reconnection_delay=5,
                            reconnection_delay_max=60)
        self.is_updating = False

        self.sio.on('connect', self.on_connect)
        self.sio.on('disconnect', self.on_disconnect)
        self.sio.on('command', self.on_command)
        # self.sio.on('bike-stop', self.on_server_event)
        # self.sio.on(self.bike_id, self.on_command)

    async def initialize(self):
        """Initialize the bike asynchronously."""
        print("Initializing bike...")
        # Sleep for a random time to avoid all bikes connecting at the same time
        try:
            # Connect to the WebSocket server
            await self.sio.connect(WEBSOCKET_URL)
            await self.add_to_websocket()
            # print(f"Bike {self.bike_id} connected to WebSocket server.")
        except Exception as e:
            print(f"Error connecting to WebSocket server: {e}")
            return

    async def add_to_websocket(self):
        await self.sio.emit('bike-add', self.get_data())

    def get_data(self):
        """Return the current data of the bike."""
        return {
            "bike_id": f"{self.bike_id}",
            "battery_level": self.battery,
            "latitude": self.location[0],
            "longitude": self.location[1],
            "status": f"{self.status}",
            "simulation": self.simulated,
            "speed": self.speed,
            "timestamp": datetime.now().isoformat()
        }

    async def update_bike_data(self, status=None, location=None, battery=None):
        """Method to dynamically update bike data (status, location, battery)."""
        # print("[Bike] Updating bike data...")
        # Only update bike data if self.is_updating is False

        if status:
            self.status = status
        if location:
            self.location = location
        if battery:
            self.battery = battery

        await self.send_update_to_socketio()

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
        # else:
            # update_task = asyncio.create_task(self.send_update_to_socketio())
            # await update_task


    async def send_update_to_socketio(self):
        if self.sio.connected:
            await self.sio.emit('bike-update', self.get_data())

    async def send_updates_interval_to_socketio(self):
        await asyncio.sleep(random.randint(10, SLEEP_TIME_IN_USE * 10) / 10)
        while self.status != "shutdown":
            await self.send_update_to_socketio()
            if self.status == "in_use":
                await asyncio.sleep(SLEEP_TIME_IN_USE)
            else:
                await asyncio.sleep(SLEEP_TIME_IDLE)

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

    async def on_connect(self):
        print(f"Bike {self.bike_id} connected to Socket.IO server.")

    async def on_disconnect(self):
        print(f"Bike {self.bike_id} disconnected from Socket.IO server.")

    async def on_command(self, data):
        print(data, type(data))
        try:
            # data = json.loads(data)

            if data.get("bike_id").strip() != str(self.bike_id).strip():
                print(f"{data.get('bike_id')} != {self.bike_id}")
                print("Command not for this bike. Skipping.")
                return

            print(f"Received command: {data}")

            command = data.get("command")
            if command == "stop":
                await self.update_bike_data(status="maintenance")
                print(f"Bike {self.bike_id} status set to 'maintenance'")
            elif command == "available":
                await self.update_bike_data(status="available")
                print(f"Bike {self.bike_id} status set to 'available'")
            elif command == "rented":
                await self.update_bike_data(status="in_use")
                print(f"Bike {self.bike_id} status set to 'in_use'")
            elif command == "charge":
                await self.update_bike_data(status="charging")
                print(f"Bike {self.bike_id} status set to 'charging'")
            elif command == "kill":
                await self.update_bike_data(status="shutdown")
                print(f"Bike {self.bike_id} status set to 'shutdown'")
            else:
                print(f"Unknown command: {command}")

            await self.send_update_to_socketio()

        except json.JSONDecodeError as e:
            print(f"Failed to parse command data: {e}")
        except Exception as e:
            print(f"Error handling command: {e}")




if __name__ == "__main__":
    bike1 = Bike(BIKE_ID, simulated=True)
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