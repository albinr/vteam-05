import sys
import os

# Add the `sim-soft/src` directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

import unittest
from bike import Bike

class TestScooter(unittest.TestCase):
    def setUp(self):
        self.scooter = Bike(1)

    def test_placeholder(self):
        self.assertTrue(True)

if __name__ == "__main__":
    unittest.main()
