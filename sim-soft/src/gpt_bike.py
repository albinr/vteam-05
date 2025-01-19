"""
bike_simplified.py

A simplified Bike class for simulating an electric bike without random status changes.
Status changes are handled only by commands from the server or manual updates in code.
"""

import asyncio
import random
import uuid
from datetime import datetime

from socketio import AsyncClient

# Constants
SLEEP_TIME_IN_USE = 10      # seconds to sleep when the bike is in use
SLEEP_TIME_IDLE = 60       # seconds to sleep when the bike is idle

WEBSOCKET_URL = "http://backend:1337"  # Example server endpoint

class Bike:
    """
    A simplified Bike class that simulates:
        - Battery drain/charge
        - Movement (if 'in_use')
        - Socket.IO communication for sending/receiving data
    """

    def __init__(self, bike_id=None, location=(0.0, 0.0), simulated=True):

        self.bike_id = bike_id or uuid.uuid4()
        self.simulated = simulated

        # State
        self.battery = 100
        self.status = "available"  # can be 'available', 'in_use', 'charging', 'maintenance', 'shutdown'
        self.location = location
        self.speed = 0.0
        self.speed_limit = 20.0

        # Socket.IO client
        self.sio = AsyncClient(
            reconnection=True,
            reconnection_attempts=5,
            reconnection_delay=5,
            reconnection_delay_max=60
        )
        self.sio.on("connect", self.on_connect)
        self.sio.on("disconnect", self.on_disconnect)
        self.sio.on("command", self.on_command)

    async def initialize(self):
        """Connects to the Socket.IO server and informs the server about this bike."""
        try:
            # Optional: Sleep a small, random amount to stagger connections
            await asyncio.sleep(random.uniform(0, 2))

            await self.sio.connect(WEBSOCKET_URL)
            await self._add_bike_to_server()
            print(f"[Bike {self.bike_id}] Connected to server.")
        except Exception as e:
            print(f"[Bike {self.bike_id}] Failed to connect: {e}")

    async def run_simulation(self):
        """
        Main simulation loop.
            - Drain or charge battery depending on status
            - Move location if in use
            - Emit bike state to server
            - Sleep (5s if in use, 60s if idle/charging/maintenance)
            - Stop if status becomes 'shutdown'
        """
        if not self.sio.connected:
            return  # No simulation if we failed to connect

        while self.status != "shutdown":
            # 1. Update battery
            if self.status == "in_use":
                # Simulate battery drain
                self.battery -= random.uniform(0.3, 1.0)
            elif self.status == "charging":
                # Simulate battery charging
                self.battery += random.uniform(0.3, 1.0)

            # Clamp battery between 0 and 100
            self.battery = max(0, min(100, self.battery))

            # 2. Update location if in use and has battery
            if self.status == "in_use" and self.battery > 0:
                dx = random.uniform(-0.001, 0.001)
                dy = random.uniform(-0.001, 0.001)
                self.location = (self.location[0] + dx, self.location[1] + dy)

                # Estimate speed in km/h (very rough approximation)
                distance_km = (dx**2 + dy**2) ** 0.5 * 111  # 1 degree ~ 111 km
                self.speed = distance_km / (SLEEP_TIME_IN_USE / 3600.0)
                self.speed = min(self.speed, self.speed_limit)
            else:
                self.speed = 0

            # 3. Send an update to the server
            await self._send_bike_update()

            # 4. Sleep for different durations based on status
            sleep_duration = SLEEP_TIME_IN_USE if self.status == "in_use" else SLEEP_TIME_IDLE
            await asyncio.sleep(sleep_duration)

        print(f"[Bike {self.bike_id}] Shutting down...")

    # --------------------------
    # Socket.IO Event Handlers
    # --------------------------
    async def on_connect(self):
        print(f"[Bike {self.bike_id}] Socket.IO connected.")

    async def on_disconnect(self):
        print(f"[Bike {self.bike_id}] Socket.IO disconnected.")

    async def on_command(self, data):
        """
        Handles commands like:
            { "bike_id": "<some-id>", "command": "stop" }
        Only acts if bike_id matches this bike's ID.
        """
        try:
            if str(data.get("bike_id")) != str(self.bike_id):
                return  # Not for this bike

            command = data.get("command")
            if command == "stop":
                self.status = "maintenance"
            elif command == "available":
                self.status = "available"
            elif command == "rented":
                self.status = "in_use"
            elif command == "charge":
                self.status = "charging"
            elif command == "kill":
                self.status = "shutdown"
            else:
                print(f"[Bike {self.bike_id}] Unknown command: {command}")

            # Immediately send an update after a command
            await self._send_bike_update()

        except Exception as e:
            print(f"[Bike {self.bike_id}] Error processing command: {e}")

    # --------------------------
    # Internal Helpers
    # --------------------------
    async def _add_bike_to_server(self):
        """Emit an event to tell the server that a new bike is here."""
        await self.sio.emit("bike-add", self._serialize_data())

    async def _send_bike_update(self):
        """Emit an event to send the current bike state to the server."""
        if self.sio and self.sio.connected:
            await self.sio.emit("bike-update", self._serialize_data())

    def _serialize_data(self):
        """Package the bike's state into a dictionary."""
        return {
            "bike_id": str(self.bike_id),
            "battery_level": self.battery,
            "latitude": self.location[0],
            "longitude": self.location[1],
            "status": self.status,
            "speed": self.speed,
            "timestamp": datetime.now().isoformat(),
            "simulation": self.simulated
        }

# -----------------------------
# Example usage: Single bike
# -----------------------------
if __name__ == "__main__":
    async def main():
        bike = Bike(simulated=True)
        await bike.initialize()     # Connect to Socket.IO
        await bike.run_simulation() # Start main simulation loop

    asyncio.run(main())
