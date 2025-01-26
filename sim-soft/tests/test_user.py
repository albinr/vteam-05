"""
test_user.py

Test file for user clas
"""


import unittest
from unittest.mock import patch
import requests
from src.user import User


class TestUser(unittest.TestCase):
    """
    Unittest for user class
    """
    @patch('requests.post')
    @patch('builtins.print')
    def setUp(self, mock_post, _):
        mock_post.return_value.status_code = 201
        self.user = User(1, "user", "user@gmail.com")

    @patch('requests.post')
    @patch('builtins.print')
    def test_register_success(self, mock_post, _):
        """
        Test user-registration is successful
        """
        mock_post.return_value.status_code = 201
        self.user.added_to_db = False
        self.user.added_to_db_tries = 0
        self.user.register()
        self.assertTrue(self.user.added_to_db)
        self.assertEqual(self.user.added_to_db_tries, 1)

    @patch('builtins.print')
    def test_register_failure(self, _):
        """
        Test user-registration is failure
        """
        self.user.added_to_db = False
        self.user.added_to_db_tries = 0
        with patch('requests.post', side_effect=requests.exceptions.RequestException):
            self.user.register()
        self.assertFalse(self.user.added_to_db)
        self.assertEqual(self.user.added_to_db_tries, 1)

    @patch('builtins.print')
    def test_update_bikes(self, _):
        """
        Test updating bike data
        """
        bikes = [{"bike_id": 1, "status": "available"}, {"bike_id": 2, "status": "available"}]
        self.user.update_bikes(bikes)
        self.assertEqual(self.user.bikes, bikes)

if __name__ == "__main__":
    unittest.main()
