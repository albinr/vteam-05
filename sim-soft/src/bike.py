import asyncio
from datetime import datetime
import socketio

min_battery = 20
sleep_time = 1
sleep_time_locked = 5

class Bike:
    def __init__(
                self,
                bike_id,
                status="locked",
                battery=100,
                location=(None, None), # (lat,long)
                server_url="https://c2195955-eebf-49af-836d-f3372f7abfae.mock.pstmn.io",
            ):
        self.bike_id = bike_id
        self.status = status # locked, unlocked, idle, charging
        self.battery = battery
        self.location = location
        self.server_url = server_url
        self.sio = socketio.AsyncClient()

    async def update(self, status=None, battery=None, location=None):
        """Update bike data."""
        self.status = status if status else self.status
        self.battery = battery if battery else self.battery
        self.location = location if location else self.location

        return self.get_data()

    async def charging(self):
        """Set the status to charging"""
        self.status = "charging"

        return self.status

    def unlock(self):
        """Set the status to unlocked"""
        self.status = "unlocked"
        print(f"[bike {self.bike_id}] Unlocked")
        return self.status

    def lock(self):
        """Set the status to locked"""
        self.status = "locked"
        print(f"[bike {self.bike_id}] Locked")
        return self.status

    async def idle(self):
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
        try:
            # await self.sio.connect(self.server_url) # To connect to server
            # print(f"bike {self.bike_id} connected to server at {self.server_url}")
            while True:
                data = self.get_data()

                if self.battery > min_battery:
                    # TODO: Send update to server
                    # await self.sio.emit("bike_update", data) # To send update to server
                    print(f"[bike {self.bike_id}] Refreshed")
                    print(f"[bike {self.bike_id}] Data sent: {data}")
                else:
                    # TODO: Send update to server with warning about battery level
                    print(f"[bike {self.bike_id}] Low battery")
                    # await self.sio.emit("bike_warning", data) # To send warning to server

                if self.status == "locked":
                    await asyncio.sleep(sleep_time_locked)
                else:
                    await asyncio.sleep(sleep_time)
        except Exception as e:
            print(f"[bike {self.bike_id}] Error: {e}")
        finally:
            # await self.sio.disconnect() # To disconnect from server
            pass

    async def run(self):
        await self.send_updates()

if __name__ == "__main__":
    async def main():
        bike = Bike(bike_id=1, location=(59.3293, 18.0686))

        update_task = asyncio.create_task(bike.run())

        await asyncio.sleep(5)

        bike.unlock()

        for i in range(5):
            new_location = (bike.location[0] + 0.01 * i, bike.location[1] - 0.01 * i)
            await bike.update(location=new_location)
            print(f"[Main] Updated location to: {new_location}")
            await asyncio.sleep(2)

        bike.lock()

        update_task.cancel()
        try:
            await update_task
        except asyncio.CancelledError:
            print("[Main] Background updates stopped")

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("[Simulation] Simulation interrupted by user.")