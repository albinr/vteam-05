import unittest
from src.bike import Bike
import datetime
class TestBike(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.bike = Bike(1)

    def test_is_bike(self):
        """
        Test if bike is correct instance of class.
        """
        self.assertIsInstance(self.bike, Bike)
        
    def test_bike_with_set_params(self):
        """ 
        Test if bike with specific params gets set
        """
        self.bike_two = Bike(2, battery=43.43, min_battery=10, status="idle", location=(0.1, 0.1), simulated=False)
        
        self.assertEqual(self.bike_two.bike_id, 2)
        self.assertEqual(self.bike_two.battery, 43.43)
        self.assertEqual(self.bike_two.min_battery, 10)
        self.assertEqual(self.bike_two.location, (0.1, 0.1))
        self.assertEqual(self.bike_two.simulated, False)
    
    def test_bike_send_update(self):
        """
        Test for bike to send updates
        """
        pass
    
    def test_get_bike_data(self):
        """
        Test for getting bike data
        """
        data = self.bike.get_data()
        self.assertEqual(data["bike_id"].strip(),"1")
        self.assertEqual(data["battery"], "100.00")
        self.assertEqual(data["location"], (0,0))
        self.assertEqual(data["status"].strip(), "locked")

        # TODO: Fix this part of test
        # try:
        #     print(data["timestamp"])
        #     print(type(data["timestamp"]))
        #     datetime.date.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
        #     timestamp_is_valid = True
        # except ValueError:
        #     timestamp_is_valid = False
        # self.assertTrue(timestamp_is_valid)

    async def test_update_bike_data(self):
        """
        Test for updating bike data.
        """
        # self.bike.update_bike_data(status="unlocked", location=(0.2, 0.2), battery=20)

        # self.assertEqual(self.bike.status, "unlocked")
        # self.assertEqual(self.bike.location, (0.2, 0.2))
        # self.assertEqual(self.bike.battery, 20)

        await self.bike.update_bike_data(
            status="unlocked",
            location=(59.3293, 18.0686),
            battery=85.5
        )

        self.assertEqual(self.bike.status, "unlocked")
        self.assertEqual(self.bike.location, (59.3293, 18.0686))
        self.assertAlmostEqual(self.bike.battery, 85.5, places=2)

        await self.bike.update_bike_data(status="locked")
        self.assertEqual(self.bike.status, "locked")
        self.assertEqual(self.bike.location, (59.3293, 18.0686))
        self.assertAlmostEqual(self.bike.battery, 85.5, places=2)
        

if __name__ == "__main__":
    unittest.main()
