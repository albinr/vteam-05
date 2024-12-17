"""
bike.py

This module defines a Bike class to simulate the behavior and state of an electric bike
in a system for renting bikes, now enhanced with WebSocket communication.
"""

import asyncio
import random
import uuid
from datetime import datetime
import requests
import websockets  # WebSocket library for Python

# Constants
SLEEP_TIME = 1  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 5  # Seconds for sending updates to API
MIN_TRAVEL_TIME = 0.1
MAX_TRAVEL_TIME = 0.5

API_URL = "http://backend:1337"
WEBSOCKET_URL = "ws://backend:1337"  # WebSocket URL
BIKE_ID = uuid.uuid4()


class Bike:
    """
    Bike class for simulating an electric bike.
    """
    def __init__(self, bike_id, battery=100, min_battery=20,
                status="available", location=(0, 0), simulated=False):
        self.bike_id = bike_id
        self.battery = battery
        self.min_battery = min_battery
        self.location = location
        self.status = status
        self.simulated = simulated
        self.added_to_db = False
        self.add_to_db_tries = 0
        self.websocket = None  # WebSocket connection

        while not self.added_to_db and self.add_to_db_tries < 3:
            self.add_bike_to_system()

    def add_bike_to_system(self):
        """Add the bike to the system using REST API."""
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

    async def connect_to_websocket(self):
        """Connect to the WebSocket server."""
        try:
            self.websocket = await websockets.connect(WEBSOCKET_URL)
            print(f"Bike {self.bike_id} connected to WebSocket server.")

            # Send initial connection message
            await self.websocket.send(f"Connected: Bike {self.bike_id}")

            # Start listening to incoming WebSocket messages
            asyncio.create_task(self.listen_to_websocket())
        except Exception as e:
            print(f"Error connecting to WebSocket: {e}")


    async def listen_to_websocket(self):
        """Listen for incoming WebSocket messages."""
        try:
            async for message in self.websocket:
                print(f"Bike {self.bike_id} received WebSocket message: {message}")
                # Example: Handle commands (e.g., start trip, stop trip)
                if message == "start_trip":
                    self.status = "in_use"
                elif message == "stop_trip":
                    self.status = "available"
        except Exception as e:
            print(f"Error in WebSocket communication: {e}")

    async def send_update_via_websocket(self):
        """Send periodic updates to the WebSocket server."""
        while self.status != "shutdown":
            try:
                # Check if the WebSocket connection is still open
                if self.websocket and self.websocket.open:
                    data = self.get_data()
                    await self.websocket.send(str(data))
                    print(f"Sent WebSocket update: {data}")
                else:
                    print(f"WebSocket closed for Bike {self.bike_id}. Reconnecting...")
                    await self.connect_to_websocket()  # Attempt to reconnect
            except Exception as e:
                print(f"Error sending WebSocket update: {e}")
                await asyncio.sleep(2)  # Retry after a short delay

            # Dynamic sleep based on bike status
            if self.status == "in_use":
                await asyncio.sleep(5)  # Update every 5 seconds
            else:
                await asyncio.sleep(30)  # Update every 30 seconds


    def get_data(self):
        """Return the current data of the bike."""
        return {
            "bike_id": str(self.bike_id),
            "battery": round(self.battery, 2),
            "location": self.location,
            "status": self.status,
            "timestamp": datetime.now().isoformat()
        }

    async def run_bike_interval(self):
        """Start all background tasks."""
        await self.connect_to_websocket()  # Connect to WebSocket server

        if self.simulated:
            tasks = [
                asyncio.create_task(self.sim_battery()),
                asyncio.create_task(self.sim_travel()),
                asyncio.create_task(self.sim_random_bike_status()),
                asyncio.create_task(self.send_update_via_websocket())
            ]
            await asyncio.gather(*tasks)
        else:
            await asyncio.create_task(self.send_update_via_websocket())

    async def sim_battery(self):
        """Simulate battery drain."""
        while self.status != "shutdown":
            if self.status == "in_use":
                self.battery -= random.uniform(0.01, 0.05)
            elif self.status == "charging" and self.battery < 100:
                self.battery = min(self.battery + random.uniform(0.01, 0.05), 100)
            await asyncio.sleep(SLEEP_TIME)

    async def sim_travel(self):
        """Simulate bike movement."""
        while self.status != "shutdown":
            if self.status == "in_use":
                self.location = (
                    self.location[0] + random.uniform(-0.005, 0.005),
                    self.location[1] + random.uniform(-0.005, 0.005)
                )
                print(f"Bike {self.bike_id} moved to {self.location}")
            await asyncio.sleep(SLEEP_TIME)

    async def sim_random_bike_status(self):
        """Simulate status changes."""
        while self.status != "shutdown":
            self.status = random.choice(['available', 'in_use', 'maintenance', 'charging'])
            print(f"Bike {self.bike_id} status updated to {self.status}")
            await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME))


if __name__ == "__main__":
    bike = Bike(BIKE_ID)
    asyncio.run(bike.run_bike_interval())
