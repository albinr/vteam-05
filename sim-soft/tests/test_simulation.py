import unittest
from src.simulation import Simulation

class TestSimulation(unittest.TestCase):
    def setUp(self):
        self.sim = Simulation(1)

    def test_simulation_initial_state(self):
        self.assertEqual(self.sim.state, "initialized")

if __name__ == "__main__":
    unittest.main()
