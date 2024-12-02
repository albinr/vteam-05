# import sys
# import os

# # Add the `sim-soft/src` directory to the Python path
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

# import unittest
# from test_simulation import TestSimulation
# from test_scooter import TestScooter
# from test_user import TestUser

# def suite():
#     test_suite = unittest.TestSuite()
#     test_suite.addTest(unittest.makeSuite(TestSimulation))
#     test_suite.addTest(unittest.makeSuite(TestScooter))
#     test_suite.addTest(unittest.makeSuite(TestUser))
#     return test_suite

# if __name__ == "__main__":
#     runner = unittest.TextTestRunner()
#     runner.run(suite())
