"""
test_simulation.py

Tests for the simulation class
"""

import unittest
import asyncio
from src.simulation import Simulation
# from src.bike import Bike

class TestSimulation(unittest.TestCase):
    """
    Test case for simulation
    """
    def setUp(self):
        self.sim = Simulation(5)

    def test_simulation_initial_state(self):
        """
        Test for class initial state
        """
        self.assertEqual(self.sim.state, "initialized")

    def test_simulation_bike_ammount(self):
        """
        Test that bikes are added to the simulation
        """
        self.assertEqual(len(self.sim.bikes), 5)

    def test_simulation_start(self):
        """
        Test starting simulation, run for 1 second and see that the state is updated
        """
        async def run_simulation():
            try:
                await asyncio.wait_for(self.sim.start(), timeout=1.0) # Timeout to stop loop
            except asyncio.TimeoutError:
                pass

        asyncio.run(run_simulation())
        self.assertEqual(self.sim.state, "running")

    def test_simulation_update_bike(self):
        """
        Test that the simulation updates bike
        """
        asyncio.run(self.sim.update_bike_data(1, battery=12.34))
        self.assertEqual(self.sim.bikes[0].battery, 12.34)


if __name__ == "__main__":
    unittest.main()
