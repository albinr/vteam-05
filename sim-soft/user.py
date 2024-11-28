import json, random, time, os
from datetime import datetime

class User:
    def __init__(self, user_id, bike_id):
        self.user_id = user_id
        self.name = 100
        self.location = {"latitude": 59.3293, "longitude": 18.0686}
        self.bike_id = bike_id

    def update(self):
        pass

    def run(self):
        while self.name > 0:
            self.update()
            time.sleep(5)
