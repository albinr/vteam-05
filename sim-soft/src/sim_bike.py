"""
bike.py

This module defines a Bike class to simulate the behavior and state of an electric bike
in a system for renting bikes.
"""

import asyncio
import random
import uuid
import math
from geopy.distance import geodesic
from src.bike import Bike

# Constants
SLEEP_TIME_IN_USE = 5
SLEEP_TIME_IDLE = 60

SLEEP_TIME = 10  # Seconds for simulation update loop
API_UPDATE_INTERVAL = 11  # Seconds for sending updates to API

MIN_TRAVEL_TIME = 5 # Minutes of minimum travel time for simulation
MAX_TRAVEL_TIME = 10 # Minutes of maximum travel time for simulation

BIKE_ID = uuid.uuid4()

class SimBike(Bike): # pylint: disable=too-many-instance-attributes
    """
    Bike class for simulating an electric bike.
    """
    def __init__(self, *args, start_type=None, dest_type=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.simulated = True
        self.start_location = None
        self.destination = None
        self.start_type = start_type
        self.dest_type = dest_type
        self.moving = False

    def set_start_location(self, latitude, longitude):
        """Save the start location of the bike, so it can later be switched with destinaiton."""
        self.start_location = (latitude, longitude)
        print(f"Bike {self.bike_id} destination set to {self.destination}")

    def set_destination(self, latitude, longitude):
        """Assign a destination to the bike."""
        self.destination = (latitude, longitude)
        print(f"Bike {self.bike_id} destination set to {self.destination}")

    def calculate_bearing(self, start, end):
        """Calculate the bearing from start to end coordinates."""
        start_lat, start_lon = math.radians(start[0]), math.radians(start[1])
        end_lat, end_lon = math.radians(end[0]), math.radians(end[1])
        d_lon = end_lon - start_lon

        x = math.sin(d_lon) * math.cos(end_lat)
        y = (math.cos(start_lat) * math.sin(end_lat) -
             math.sin(start_lat) * math.cos(end_lat) * math.cos(d_lon))
        bearing = math.atan2(x, y)
        return (math.degrees(bearing) + 360) % 360

    async def run_bike_interval(self):
        """Start the update loop for sending data and battery drain."""
        # Run all tasks in the background

        if not self.sio.connected:  # Connect only if not already connected
            return

        if self.simulated:
            battery_task = asyncio.create_task(self.sim_battery())
            travel_task = asyncio.create_task(self.sim_travel())
            status_task = asyncio.create_task(self.sim_random_bike_status())
            update_task = asyncio.create_task(self.send_updates_interval_to_socketio())

            await asyncio.gather(battery_task, travel_task, status_task, update_task)


    async def sim_battery(self):
        """Simulate battery drain when bike is unlocked."""
        while self.status != "shutdown":
            if self.status == "in_use":
                # Simulate battery drain
                self.battery -= random.uniform(0.01, 0.05)
            if self.status == "charging" and self.battery < 100:
                # Simulate battery charging
                self.battery += random.uniform(0.01, 0.05)

                # Make sure that the battery doesn't go over 100
                if self.battery > 100: # pylint: disable=consider-using-min-builtin
                    self.battery = 100
                    await self.update_bike_data(status="available")

            # await self.send_update_to_socketio()

            await asyncio.sleep(SLEEP_TIME)

    async def sim_travel(self):
        """Simulate travel to the assigned destination."""
        while self.status != "shutdown":
            if self.status == "in_use" and self.battery > 0 and self.destination:
                await asyncio.sleep(SLEEP_TIME_IN_USE)

                # Calculate the distance to the destination
                distance_to_dest = geodesic(self.location, self.destination).meters
                if distance_to_dest < 10:  # Close enough to the destination
                    self.location = self.destination  # Snap to destination
                    self.speed = 0

                    if self.dest_type == "chargestation":
                        await self.update_bike_data(status="charging")
                        print(f"Bike {self.bike_id} is charging at {self.destination}.")
                    else:
                        await self.update_bike_data(status="available")
                        print(f"Bike {self.bike_id} is available at {self.destination}.")

                    self.start_location, self.destination = self.destination, self.start_location
                    self.start_type, self.dest_type = self.dest_type, self.start_type
                    print(f"Bike {self.bike_id} arrived at destination. {self.status}")
                    # await self.update_bike_data(status="available") # Redundant?
                else:
                    if not self.speed:
                        self.speed = random.uniform(5, self.speed_limit)
                    # Move toward the destination
                    bearing = self.calculate_bearing(self.location, self.destination)
                    delta_lat = (self.speed / 111320) * math.cos(math.radians(bearing))
                    delta_lon = (
                        self.speed / (111320 * math.cos(math.radians(self.location[0])))
                    ) * math.sin(math.radians(bearing))
                    self.location = (self.location[0] + delta_lat, self.location[1] + delta_lon)
                    self.battery -= random.uniform(0.01, 0.05)  # Simulate battery drain
                    print(f"Bike {self.bike_id} is moving to destination.")
                    print(f"Bike {self.bike_id} location: {self.location}")

                # Send an update to the WebSocket server
                await self.send_update_to_socketio()
            else:
                await asyncio.sleep(SLEEP_TIME_IDLE)

    async def sim_random_bike_status(self):
        """ Randomly change the bike status."""
        while self.status != "shutdown":
            # self.status = random.choice(['available',
            #                             'available',
            #                             'available',
            #                             'charging',
            #                             'charging',
            #                             'maintenance'])
            # self.status = random.choice(['in_use',
            #                 'in_use',
            #                 'available',
            #                 'charging',
            #                 'charging',
            #                 'maintenance'])
            # self.status = "in_use"
            # print(f"[Bike {self.bike_id}] Status changed to: {self.status}")

            # Change status every X-Y minutes
            await asyncio.sleep(60 * random.uniform(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME))

async def main():
    """Main function to run the bike simulation."""
    bike1 = SimBike(BIKE_ID,location = (59.3293, 18.0686) ,simulated=True)
    # Set up the bike's initial configuration
    bike1.set_start_location(59.3293, 18.0686)  # Starting location (Stockholm center)
    bike1.set_destination(59.3420, 18.0535)  # Destination (nearby location in Stockholm)
    bike1.status = "in_use"  # Set the bike to in-use status for travel simulation

    # Initialize the bike (connect to WebSocket server, etc.)
    await bike1.initialize()

    # Run the bike simulation
    await asyncio.gather(
        bike1.run_bike_interval(),
    )

# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())
