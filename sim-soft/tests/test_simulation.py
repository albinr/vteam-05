import sys
import os

# Add the `sim-soft/src` directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

import unittest
from simulation import Simulation

class TestSimulation(unittest.TestCase):
    def setUp(self):
        self.sim = Simulation(1)

    def test_simulation_initial_state(self):
        self.assertEqual(self.sim.state, "initialized")

if __name__ == "__main__":
    unittest.main()
