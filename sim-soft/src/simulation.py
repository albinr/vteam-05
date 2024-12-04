from bike import Bike
import asyncio

class Simulation:

    def __init__(self, num_bikes=0):
        self.bikes = [Bike(bike_id=i) for i in range(1, num_bikes + 1)]  # Create a list of bikes
        self.state = "initialized"

    def list_bikes(self):
        print("[Simulation] Current Bikes:")
        for bike in self.bikes:
            print(f"Bike ID: {bike.bike_id}, Battery: {bike.battery}, Status: {bike.status}")

    async def start_bikes(self):
        tasks = [bike.run() for bike in self.bikes]  # Put tasks in list and run them async
        await asyncio.gather(*tasks)

    async def run_simulation(self):
        print("[Simulation] Starting simulation...")
        self.state = "running"
        self.list_bikes()
        try:
            await self.start_bikes()
        except asyncio.CancelledError:
            print("\n[Simulation] Simulation cancelled.")
        finally:
            self.stop()

    def start(self):
        try:
            asyncio.run(self.run_simulation())
        except KeyboardInterrupt:
            print("\n[Simulation] Simulation interrupted by user.")

    def stop(self):
        print("[Simulation] Simulation stopped.")
        self.state = "stopped"

if __name__ == "__main__":
    try:
        simulation = Simulation(num_bikes=3000)
        simulation.start()
    except KeyboardInterrupt:
        print("[Simulation] Simulation ended.")
