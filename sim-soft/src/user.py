import json, random, time, os
from datetime import datetime

class User:
    def __init__(self, user_id, username, bike_id):
        self.user_id = user_id
        self.username = username
        self.bike_id = bike_id
        self.is_alive = True

    def update(self):
        pass

    def register(self):
        pass

    def rentScooter(self):
        pass

    def returnScooter(self):
        pass

    def run(self):
        while self.alive:
            self.update()
            time.sleep(5)
