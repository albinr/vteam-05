import json, random, time, os
from datetime import datetime

class Scooter:
    def __init__(self, scooter_id):
        self.scooter_id = scooter_id
        self.battery = 100
        self.location = {"latitude": 59.3293, "longitude": 18.0686}
        self.charging = False
        self.disabled = False

    def update(self):
        self.battery = max(self.battery - random.uniform(0.5, 1.5), 0)
        self.location["latitude"] += random.uniform(-0.0001, 0.0001)
        self.location["longitude"] += random.uniform(-0.0001, 0.0001)
        self.save_data()

    def save_data(self):
        data = {
            "scooter_id": self.scooter_id,
            "battery": round(self.battery, 2),
            "location": self.location,
            "timestamp": datetime.now().isoformat()
        }
        with open(f"scooter_{self.scooter_id}.json", "w") as file:
            json.dump(data, file)
        print(f"Data saved: {data}")

    def run(self):
        while self.battery > 0:
            self.update()
            time.sleep(5)

if __name__ == "__main__":
    scooter_id = os.getenv("SCOOTER_ID", "default_id")
    Scooter(scooter_id).run()
