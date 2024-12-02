# simulation.py

from scooter import Scooter

class Simulation:
    """
    A class to represent a scooter simulation environment.

    Attributes:
    -----------
    users : int
        The number of users participating in the simulation.
    bikes : int
        The number of bikes available in the simulation.

    Methods:
    --------
    start():
        Starts the simulation.
    stop():
        Stops the simulation.
    """

    def __init__(self, bikes, users=0):
        """
        Initializes the Simulation with a given number of bikes and users.

        Parameters:
        -----------
        bikes : int
            The number of bikes to include in the simulation.
        users : int, optional
            The number of users to include in the simulation (default is 0).
        """
        self.users = users
        self.bikes = bikes
        self.state = "initialized"

    def start(self):
        """
        Starts the simulation.

        This method should contain logic to initialize and begin
        the simulation of scooters and users in the environment.
        """
        pass

    def stop(self):
        """
        Stops the simulation.

        This method should contain logic to end and clean up after
        the simulation has finished running.
        """
        pass

if __name__ == "__main__":
    scooter = Scooter(scooter_id=1)
    scooter.run()
