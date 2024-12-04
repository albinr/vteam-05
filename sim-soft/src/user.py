import json, random, time, os
from datetime import datetime
from bike import Bike

class User:
    def __init__(self, user_id, username):
        self.user_id = user_id
        self.username = username
        self.bike = None # Holder for bike class- A user starts without a bike

    async def update(self):
        """Simulate user activity."""
        if self.bike:
            # Example of updating location if traveling might be changed to routes?
            self.location = (self.location[0] + random.uniform(-0.01, 0.01),
                            self.location[1] + random.uniform(-0.01, 0.01))
            print(f"[User {self.user_id}] Traveling. New location: {self.location}")
        else:
            print(f"[User {self.user_id}] Waiting for a bike.")

    async def register(self):
        # regiser the user
        pass

    async def rent_bike(self):
        # fetch bikes and choose one
        # set the bike instance in self.bike
        pass

    async def travel(self, location):
        # self.bike.update(location)
        pass

    async def return_bike(self):
        # send request to park bike
        # bike locks
        pass

    async def run(self):
        while True:
            self.update()
            time.sleep(5)
