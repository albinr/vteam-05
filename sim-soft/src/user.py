"""
user.py

This module defines a User class to simulate the behavior and state of a user 
in a system for renting bikes.
"""

import random
import time
# from src.bike import Bike

class User:
    """
    User class for simulation a user
    """
    def __init__(self, user_id, username, bike_id):
        self.user_id = user_id
        self.username = username
        self.bike_id = bike_id
        self.bike = None # Holder for bike class- A user starts without a bike

    async def update(self):
        """Simulate user activity."""
        if self.bike:
            # Example of updating location if traveling might be changed to routes?
            self.bike.location = (self.location[0] + random.uniform(-0.01, 0.01),
                            self.location[1] + random.uniform(-0.01, 0.01))
            print(f"[User {self.user_id}] Traveling. New location: {self.location}")
        else:
            print(f"[User {self.user_id}] Waiting for a bike.")

    async def register(self):
        """
        Method for registering the user
        """
        # regiser the user
        print("hello")

    async def rent_bike(self):
        """
        Method for renting a bike for the user
        """
        # fetch bikes and choose one
        # set the bike instance in self.bike
        print("hello")

    async def travel(self, location):
        """
        Method for updating the users bike to simulate travel
        """
        # self.bike.update(location)
        print("hello", location)

    async def return_bike(self):
        """
        Method for returning a rented bike
        """
        # send request to park bike
        # bike locks
        print("hello")

    async def run(self):
        """
        Run the user
        """
        while True:
            self.update()
            time.sleep(5)
