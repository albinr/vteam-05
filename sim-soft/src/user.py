"""
user.py

This module defines a User class to simulate the behavior and state of a user 
in a system for renting bikes.
"""

import random
import asyncio
import requests

MIN_TRAVEL_TIME = 0.1 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 0.5 # Minutes of maximum travel time for simulation

RETRY_INTERVAL = 5

API_URL="http://backend:1337"

class User:
    """
    User class for simulation a user
    """
    def __init__(self, user_id, username, email):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.balance = 1000 - random.randint(0, 300)
        self.bike = None

        self.register()

    # async def update(self):
    #     """Simulate user activity."""
    #     if self.bike:
    #         # Example of updating location if traveling might be changed to routes?
    #         self.bike.location = (self.location[0] + random.uniform(-0.01, 0.01),
    #                         self.location[1] + random.uniform(-0.01, 0.01))
    #         print(f"[User {self.user_id}] Traveling. New location: {self.location}")
    #     else:
    #         print(f"[User {self.user_id}] Waiting for a bike.")

    def register(self):
        """
        Method for registering the user
        """
        try:
            requests.post(f"{API_URL}/v1/add_user", timeout=30, data={
                "username": self.username,
                "email": self.email,
                "balance": self.balance
            })
        except requests.exceptions.RequestException as e:
            print(f"[User {self.user_id}] Error registering user: {e}")
            return

        # regiser the user
        print(f"[{self.user_id}] User registered")

    async def run_user_interval(self):
        """Start the loop for simulating user."""
        # Run all tasks in the background
        update_task = asyncio.create_task(self.rent_bike())


        await asyncio.gather(update_task)

    async def rent_bike(self):
        """
        Method for renting a bike for the user
        """
        # fetch bikes and choose one
        # set the bike instance in self.bike

        while not self.bike:
            # get random bike with status available??
            try:
                # Get available bikes
                # bikes = requests.get(f"{API_URL}/v1/bikes/available")

                # if not bikes:
                #     pass
                # self.bike = random.choice(bikes).bike_id
                # print("pass")
                raise NotImplementedError("Not implemented")

                # Request (pots) to rent bike (trip)
            except NotImplementedError as _:
                # print(f"[User {self.user_id}] Error renting bike: {e}")
                await asyncio.sleep(RETRY_INTERVAL)

        if self.bike:
            # Return bike
            print("pass")

        await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME))


    async def return_bike(self):
        """
        Method for returning a rented bike
        """
        # send request to park bike
        # bike locks
        print("hello")

    # async def run(self):
    #     """
    #     Run the user
    #     """
    #     while True:
    #         time.sleep(5)
