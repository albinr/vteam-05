"""
user.py

This module defines a User class to simulate the behavior and state of a user
in a system for renting bikes.
"""

import random
import asyncio
import requests

MIN_TRAVEL_TIME = 3 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 10 # Minutes of maximum travel time for simulation

RETRY_INTERVAL = 5
RETURN_OR_HIRE_PROBABILITY = 4
RENT_INTERVAL = 2

API_URL="http://backend:1337"

class User: # pylint: disable=too-many-instance-attributes
    """
    User class for simulation a user
    """
    def __init__(self, user_id, username, email):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.balance = 1000 - random.randint(0, 300) # Kanske ta bort (bara i databasen?)
        self.bikes = []
        self.bike = None
        self.bike_rented = False
        self.added_to_db = False
        self.added_to_db_tries = 0

        while not self.added_to_db and self.added_to_db_tries < 3:
            self.register()

    def register(self):
        """
        Method for registering the user
        """
        try:
            requests.post(f"{API_URL}/v2/users", timeout=30, data={
                # "username": self.username,
                "user_id": self.user_id,
                "email": self.email,
                "balance": self.balance,
                "isSimulated": 1
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
        while True:
            if self.bike:
                if not self.bike_rented:
                # rent bike if not rented already
                    if random.randint(1, RETURN_OR_HIRE_PROBABILITY) == 1:
                        try:
                            requests.post(f"{API_URL}/v2/trips/start/{self.bike}/{self.user_id}",
                                        timeout=30)
                            self.bike_rented = True
                            print(f"[User {self.user_id}] Bike rented: {self.bike}")
                        except requests.exceptions.RequestException as e:
                            print(f"[User {self.user_id}] Error renting bike: {e}")

                else:
                    if random.randint(1, RETURN_OR_HIRE_PROBABILITY) == 1:
                        try:
                            requests.post(f"{API_URL}/v2/trips/end/{self.bike}", timeout=30)
                            self.bike_rented = False
                            print(f"[User {self.user_id}] Bike returned: {self.bike}")
                        except requests.exceptions.RequestException as e:
                            print(f"[User {self.user_id}] Error returning bike: {e}")
                # return bike after random time

            # await asyncio.sleep(RENT_INTERVAL)
            await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME / RETURN_OR_HIRE_PROBABILITY,
                                                    MAX_TRAVEL_TIME / RETURN_OR_HIRE_PROBABILITY))


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
