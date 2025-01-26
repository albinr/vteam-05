"""
test_bike.py

Test file for Bike class
"""

import unittest
from src.bike import Bike

class TestBike(unittest.IsolatedAsyncioTestCase):
    """
    Test for Bike class
    """
    def setUp(self):
        self.bike = Bike(1)

    def test_is_bike(self):
        """
        Test if bike is right instance (bike)
        """
        self.assertIsInstance(self.bike, Bike)

    def test_bike_with_parameters(self):
        """
        Test if bike with parameters
        """
        bike_two = Bike(2,
            battery=43.43,
            min_battery=10,
            status="idle",
            location=(0.1, 0.1),
            simulated=False)

        self.assertEqual(bike_two.bike_id, 2)
        self.assertEqual(bike_two.battery, 43.43)
        self.assertEqual(bike_two.min_battery, 10)
        self.assertEqual(bike_two.location, (0.1, 0.1))
        self.assertEqual(bike_two.simulated, False)

    def test_get_bike_data(self):
        """
        Test for getting bike data
        """
        data = self.bike.get_data()
        self.assertEqual(data["bike_id"], "1")
        self.assertEqual(data["battery_level"], 100.00)
        self.assertEqual(data["longitude"], 0)
        self.assertEqual(data["latitude"], 0)
        self.assertEqual(data["status"], "available")

    async def test_update_bike_data(self):
        """
        Test for updating bike data.
        """
        await self.bike.update_bike_data(
            status="available",
            location=(59.3293, 18.0686),
            battery=85.5
        )

        self.assertEqual(self.bike.status, "available")
        self.assertEqual(self.bike.location, (59.3293, 18.0686))
        self.assertAlmostEqual(self.bike.battery, 85.5, places=2)

        await self.bike.update_bike_data(status="in_use")
        self.assertEqual(self.bike.status, "in_use")
        self.assertEqual(self.bike.location, (59.3293, 18.0686))
        self.assertAlmostEqual(self.bike.battery, 85.5, places=2)

if __name__ == "__main__":
    unittest.main()