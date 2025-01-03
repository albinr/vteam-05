"""
user.py

This module defines a User class to simulate the behavior and state of a user 
in a system for renting bikes.
"""

import random
import asyncio
import requests
import math

MIN_TRAVEL_TIME = 0.1 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 0.5 # Minutes of maximum travel time for simulation

RETRY_INTERVAL = 5
RENT_TIME_MAX = 100 # Max rent time in seconds

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
        self.bikes = []
        self.bike = None
        self.added_to_db = False
        self.added_to_db_tries = 0

        while not self.added_to_db and self.added_to_db_tries < 3:
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
            requests.post(f"{API_URL}/v2/users", timeout=30, data={
                # "username": self.username,
                "email": self.email,
                "balance": self.balance
            })
            self.added_to_db = True
            self.added_to_db_tries += 1
        except requests.exceptions.RequestException as e:
            print(f"[User {self.user_id}] Error registering user: {e}")
            self.added_to_db_tries += 1
            return

        print(f"[{self.user_id}] User registered")

    def update_bikes(self, list_of_bikes):
        """
        Method for updating list of bikes.
        """
        self.bikes = list_of_bikes

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
        while not self.bike:
            # If random 1-10 is 1, rent bike
            if not self.bikes:
                pass

            if random.randint(1, math.floor(RENT_TIME_MAX / RETRY_INTERVAL)) == 1:
                try:
                    if not self.bike:
                        for bike in self.bikes:
                            if bike["status"] == "available":
                                self.bike = bike["bike_id"]
                                print(f"[User {self.user_id}] Bike rented: {self.bike}")
                                break
                except requests.exceptions.RequestException as e:
                    print(f"[User {self.user_id}] Error renting bike: {e}")

                if self.bike and random.randint(1, math.floor(RENT_TIME_MAX / RETRY_INTERVAL)) == 1:
                    # return bike
                    print(f"[User {self.user_id}] Bike returned: {self.bike}")
                    pass

            await asyncio.sleep(RETRY_INTERVAL)

        # if self.bike:
            # Return bike
            # print("pass")

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
