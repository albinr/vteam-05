import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

import unittest
from user import User

class TestUser(unittest.TestCase):
    def setUp(self):
        self.user = User(1,"testuser", 1)

    def test_user_initialization(self):
        self.assertEqual(self.user.username, "testuser")

if __name__ == "__main__":
    unittest.main()
