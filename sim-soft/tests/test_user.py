"""
test_user.py

Test file for user clas
"""


import unittest
from src.user import User

class TestUser(unittest.TestCase):
    """
    Unit test class for user class
    """
    def setUp(self):
        self.user = User(1,"testuser", 1)

    def test_user_initialization(self):
        """
        Test class init
        """
        self.assertEqual(self.user.username, "testuser")

if __name__ == "__main__":
    unittest.main()
