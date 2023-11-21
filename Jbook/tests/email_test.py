import unittest
from mylogin.views import test_email
from mylogin.views import *
class emailTest(unittest.TestCase):
    def test_email(self):
        self.assertEqual(test_email(request))