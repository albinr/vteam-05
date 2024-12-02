import json
import random
import time
import asyncio
from datetime import datetime
import socketio

class Scooter:
    def __init__(
                self,
                scooter_id,
                status="idle",
                battery=100,
                location={"latitude": None, "longitude": None},
                server_url="http://localhost:3000",
            ):
        self.scooter_id = scooter_id
        self.status = status
        self.battery = battery
        self.location = location
        self.server_url = server_url
        self.sio = socketio.AsyncClient()

    def update(self):
        """Update scooter data."""
        # self.battery = max(self.battery - random.uniform(0.5, 1.5), 0)
        # self.location["latitude"] += random.uniform(-0.0001, 0.0001)
        # self.location["longitude"] += random.uniform(-0.0001, 0.0001)
        return self.get_data()

    def get_data(self):
        """Prepare data payload."""
        return {
            "scooter_id": self.scooter_id,
            "battery": round(self.battery, 2),
            "location": self.location,
            "timestamp": datetime.now().isoformat()
        }

    async def send_updates(self):
        """Send periodic updates to the server."""
        # await self.sio.connect(self.server_url)
        print(f"Connected to server at {self.server_url}")

        try:
            while self.battery > 0:
                data = self.update()
                # await self.sio.emit("scooter_update", data)
                print(f"Data sent: {data}")
                await asyncio.sleep(1)
        finally:
            await self.sio.disconnect()

    def run(self):
        asyncio.run(self.send_updates())

if __name__ == "__main__":
    scooter = Scooter(scooter_id=1)
    scooter.run()
