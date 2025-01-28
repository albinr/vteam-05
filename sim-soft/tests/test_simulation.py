""" Test for the Simulation class """

import unittest
from unittest.mock import patch, AsyncMock
import asyncio
from src.simulation import Simulation

class TestSimulation(unittest.TestCase):
    """ Test for the Simulation class """

    @patch('requests.get')
    @patch('requests.post')
    @patch('requests.delete')
    @patch('atexit.register')
    @patch('signal.signal')
    def setUp(self, mock_signal, mock_atexit, mock_delete, mock_post, mock_get): # pylint: disable=arguments-differ too-many-arguments too-many-positional-arguments
        """ Setup for tests """
        self.mock_get = mock_get
        self.mock_post = mock_post
        self.mock_delete = mock_delete
        self.mock_atexit = mock_atexit
        self.mock_signal = mock_signal
        self.mock_get.return_value.status_code = 200
        self.mock_get.return_value.json.return_value = [
            {
                "zone_id": 1,
                "name": "Gamla Stan",
                "city": "Stockholm",
                "type": "chargestation",
                "longitude": 59.328,
                "latitude": 18.0728,
                "capacity": 10,
                "radius": 30
            },
            {
                "zone_id": 2,
                "name": "Kungsträgården",
                "city": "Stockholm",
                "type": "chargestation",
                "longitude": 59.3308,
                "latitude": 18.0717,
                "capacity": 10,
                "radius": 30
            },
            {
                "zone_id": 3,
                "name": "Södermalm",
                "city": "Stockholm",
                "type": "parking",
                "longitude": 59.314,
                "latitude": 18.07,
                "capacity": 20,
                "radius": 40
            },
            {
                "zone_id": 17,
                "name": "Stortorget",
                "city": "Malmö",
                "type": "parking",
                "longitude": 55.6057,
                "latitude": 13,
                "capacity": 30,
                "radius": 30
            },
            {
                "zone_id": 18,
                "name": "Möllevångstorget",
                "city": "Malmö",
                "type": "parking",
                "longitude": 55.592,
                "latitude": 13.0074,
                "capacity": 30,
                "radius": 30
            },
            {
                "zone_id": 13,
                "name": "Blåportsgatan 2A",
                "city": "Karlskrona",
                "type": "parking",
                "longitude": 56.1766,
                "latitude": 15.5908,
                "capacity": 30,
                "radius": 30
            },
            {
                "zone_id": 12,
                "name": "Björkholmskajen",
                "city": "Karlskrona",
                "type": "parking",
                "longitude": 56.1626,
                "latitude": 15.5774,
                "capacity": 30,
                "radius": 30
            },
        ]
        self.mock_post.return_value.status_code = 201
        self.mock_delete.return_value.status_code = 201

        self.simulation = Simulation(num_bikes=5, simulated=True)

    @patch('src.simulation.Simulation.initialize_bikes', new_callable=AsyncMock)
    def test_simulation_initialization(self, mock_initialize_bikes):
        """
        Test the init of Simulation class
        """
        mock_initialize_bikes.return_value = None
        asyncio.run(self.simulation.initialize_bikes())

        self.assertEqual(self.simulation.state, "initialized")
        self.assertEqual(self.simulation.num_bikes, 5)
        self.assertTrue(self.simulation.simulated)
        self.assertEqual(len(self.simulation.bikes), 5)
        self.assertEqual(self.simulation.fetched_bikes, {})

    @patch('src.simulation.Simulation.start_bikes_and_users', new_callable=AsyncMock)
    def test_start_simulation(self, mock_start_bikes_and_users):
        """
        Test starting the simulation
        """
        mock_start_bikes_and_users.return_value = None
        asyncio.run(self.simulation.start())

        self.assertEqual(self.simulation.state, "running")

    @patch('src.simulation.SimBike.update_bike_data', new_callable=AsyncMock)
    def test_update_bike_data(self, mock_update_bike_data):
        """
        Test updating bike data
        """
        bike_id = self.simulation.bikes[0].bike_id
        asyncio.run(self.simulation.update_bike_data(bike_id, status="in_use",
                                                    location=(59.329, 18.072), battery=80))

        # Assert new data is sent (can't check the set data)
        mock_update_bike_data.assert_called_once_with("in_use", (59.329, 18.072), 80)

if __name__ == '__main__':
    unittest.main()
