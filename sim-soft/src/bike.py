import asyncio
from datetime import datetime
import socketio

min_battery = 20
sleep_time = 5
sleep_time_locked = 30

class Bike:
    def __init__(
                self,
                bike_id,
                status="locked",
                battery=100,
                location=(None, None), # Tuple for better performance (lat,long)
                server_url="https://c2195955-eebf-49af-836d-f3372f7abfae.mock.pstmn.io",
            ):
        self.bike_id = bike_id
        self.status = status # locked, unlocked, idle, charging
        self.battery = battery
        self.location = location
        self.server_url = server_url
        self.sio = socketio.AsyncClient()

    def update(self, status=None, battery=None, location=None):
        """Update bike data."""
        self.status = status if status else self.status
        self.battery = battery if battery else self.battery
        self.location = location if location else self.location

        return self.get_data()

    def charging(self):
        """Set the status to charging"""
        self.status = "charging"

        return self.status

    def unlock(self):
        """Set the status to unlocked"""
        self.status = "unlocked"

        return self.status

    def lock(self):
        """Set the status to locked"""
        self.status = "locked"

        return self.status

    def idle(self):
        """Set the status to idle"""
        self.status = "idle"

        return self.status

    def get_data(self):
        """Prepare data payload."""
        return {
            "bike_id": self.bike_id,
            "status": self.status,
            "battery": round(self.battery, 2),
            "location": self.location,
            "timestamp": datetime.now().isoformat()
        }

    async def send_updates(self):
        """Send periodic updates to the server."""
        # await self.sio.connect(self.server_url) # To connect to server
        # print(f"bike {self.bike_id} connected to server at {self.server_url}")

        try:
            while True:
                self.update()

                if self.battery > min_battery:
                    # TODO: Send update to server
                    print(f"[bike {self.bike_id}] Refreshed")
                else:
                    # TODO: Send update to server with warning about battery level
                    print(f"[bike {self.bike_id}] Low battery")

                if self.status == "locked":
                    await asyncio.sleep(sleep_time_locked)
                else:
                    await asyncio.sleep(sleep_time)
        except Exception as e:
            print(f"[bike {self.bike_id}] Error: {e}")

        # try:
        #     while self.battery > 0:
        #         data = self.update()
        #         # await self.sio.emit("bike_update", data) # To send update to server
        #         print(f"[bike {self.bike_id}] Data sent: {data}")
        #         if self.status == "locked":
        #             await asyncio.sleep(30)
        #         else:
        #             await asyncio.sleep(5)
        # except Exception as e:
        #     print(f"[bike {self.bike_id}] Error: {e}")
        # finally:
        #     await self.sio.disconnect() # To disconnect from server

    async def run(self):
        await self.send_updates()

    async def execute_command():
        pass


if __name__ == "__main__":
    async def main():
        bike = bike(bike_id=1)
        await bike.run()
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("[Simulation] Simulation interrupted by user.")
