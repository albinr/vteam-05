# """
# test_simulation.py

# Tests for the simulation class
# """

# import unittest
# from unittest.mock import patch
# from src.simulation import Simulation
# from src.sim_bike import SimBike
# from src.user import User

# class TestSimulation(unittest.TestCase):
#     """
#     Unit test class for Simulation class
#     """
#     @patch('requests.get')
#     @patch('requests.post')
#     @patch('requests.delete')
#     def setUp(self, mock_post, mock_get, mock_delete):
#         mock_get.return_value.status_code = 200
#         mock_get.return_value.json.return_value = [
#             {
#                 "zone_id": 1,
#                 "name": "Gamla Stan",
#                 "city": "Stockholm",
#                 "type": "chargestation",
#                 "longitude": 59.328,
#                 "latitude": 18.0728,
#                 "capacity": 10,
#                 "radius": 30
#             },
#             {
#                 "zone_id": 2,
#                 "name": "Kungsträgården",
#                 "city": "Stockholm",
#                 "type": "chargestation",
#                 "longitude": 59.3308,
#                 "latitude": 18.0717,
#                 "capacity": 10,
#                 "radius": 30
#             },
#             {
#                 "zone_id": 17,
#                 "name": "Stortorget",
#                 "city": "Malmö",
#                 "type": "parking",
#                 "longitude": 55.6057,
#                 "latitude": 13,
#                 "capacity": 30,
#                 "radius": 30
#             }
#         ]
#         mock_post.return_value.status_code = 201
#         mock_delete.return_value.status_code = 201
#         self.simulation = Simulation(num_bikes=5, simulated=True)
#         print("HERE!!!", self.simulation.zones)

#     def test_simulation_initialization(self):
#         """
#         Test initialization of the Simulation class
#         """
#         print("HERE!!!", self.simulation.zones)
#         self.assertEqual(self.simulation.state, "initialized")
#         self.assertEqual(self.simulation.num_bikes, 5)
#         self.assertTrue(self.simulation.simulated)
#         self.assertEqual(self.simulation.bikes, [])
#         self.assertEqual(self.simulation.fetchedBikes, {})

#     # @patch('src.simulation.SimBike')
#     # @patch('src.simulation.Simulation.fetch_zones')
#     # def test_create_simulated_bikes(self, mock_fetch_zones, MockSimBike):
#     #     """
#     #     Test creation of simulated bikes
#     #     """
#     #     mock_fetch_zones.return_value =  [
#     #         {
#     #             "zone_id": 1,
#     #             "name": "Gamla Stan",
#     #             "city": "Stockholm",
#     #             "type": "chargestation",
#     #             "longitude": 59.328,
#     #             "latitude": 18.0728,
#     #             "capacity": 10,
#     #             "radius": 30
#     #         },
#     #         {
#     #             "zone_id": 2,
#     #             "name": "Kungsträgården",
#     #             "city": "Stockholm",
#     #             "type": "chargestation",
#     #             "longitude": 59.3308,
#     #             "latitude": 18.0717,
#     #             "capacity": 10,
#     #             "radius": 30
#     #         },
#     #         {
#     #             "zone_id": 17,
#     #             "name": "Stortorget",
#     #             "city": "Malmö",
#     #             "type": "parking",
#     #             "longitude": 55.6057,
#     #             "latitude": 13,
#     #             "capacity": 30,
#     #             "radius": 30
#     #         }
#     #     ]
#     #     self.simulation.cities = ["Stockholm", "Malmö"]
#     #     self.simulation.add_start_bike(num_bikes=5, simulated=True)
#     #     self.assertEqual(len(self.simulation.bikes), 5)
#     #     self.assertEqual(self.simulation.cities, ["Stockholm", "Malmö"])
#     #     MockSimBike.assert_called()

#     # @patch('src.simulation.User')
#     # def test_interaction_with_user(self, MockUser):
#     #     """
#     #     Test interaction with the User class
#     #     """
#     #     user = MockUser.return_value
#     #     user.user_id = 1
#     #     user.username = "testuser"
#     #     user.email = "testuser@example.com"
#     #     self.simulation.users = [user]
#     #     self.assertEqual(len(self.simulation.users), 1)
#     #     self.assertEqual(self.simulation.users[0].username, "testuser")

# if __name__ == "__main__":
#     unittest.main()