""" Tests for SimBike class """

import unittest
from unittest.mock import patch
from src.sim_bike import SimBike

class TestSimBike(unittest.IsolatedAsyncioTestCase):
    """Tests for SimBike class"""
    def setUp(self):
        self.bike = SimBike(bike_id=1, location=(59.3293, 18.0686), simulated=True)

    @patch('builtins.print')
    def test_set_start_location(self, _):
        """
        Test set_start_location method
        """
        self.bike.set_start_location(59.3293, 18.0686)
        self.assertEqual(self.bike.start_location, (59.3293, 18.0686))

    @patch('builtins.print')
    def test_set_destination(self, _):
        """
        Test set_destination method
        """
        self.bike.set_destination(59.3420, 18.0535)
        self.assertEqual(self.bike.destination, (59.3420, 18.0535))

    def test_calculate_bearing(self):
        """
        Test calculate_bearing method
        """
        bearing = self.bike.calculate_bearing((59.3293, 18.0686), (59.3420, 18.0535))
        self.assertIsInstance(bearing, float)

if __name__ == '__main__':
    unittest.main()
