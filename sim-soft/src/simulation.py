from scooter import Scooter
import asyncio

class Simulation:

    def __init__(self, num_bikes=0):
        self.bikes = [Scooter(scooter_id=i) for i in range(1, num_bikes + 1)]  # Create a list of scooters
        self.state = "initialized"

    def list_scooters(self):
        print("[Simulation] Current Scooters:")
        for scooter in self.bikes:
            print(f"Scooter ID: {scooter.scooter_id}, Battery: {scooter.battery}, Status: {scooter.status}")

    async def start_scooters(self):
        tasks = [scooter.run() for scooter in self.bikes]  # Put tasks in list and run them async
        await asyncio.gather(*tasks)

    async def run_simulation(self):
        print("[Simulation] Starting simulation...")
        self.state = "running"
        self.list_scooters()
        try:
            await self.start_scooters()
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
        simulation = Simulation(num_bikes=10)
        simulation.start()
    except KeyboardInterrupt:
        print("[Simulation] Simulation ended.")
