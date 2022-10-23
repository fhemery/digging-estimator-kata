from python.src.digging_estimator import *
import unittest
from unittest.mock import MagicMock
import pytest


class DiggingEstimatorTest(unittest.TestCase):

    def test_returns_as_doctor_Pockosky_says(self):

        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        result = estimator.tunnel(28, 2, "Granite")
        assert result.total == 48


    def test_error_negative_day(self):

        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        with pytest.raises(InvalidFormatException):
           estimator.tunnel(28, -100, "Granite")


    def test_error_impossible_digging(self):

        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        with pytest.raises(TunnelTooLongForDelayException):
            estimator.tunnel(50, 1, "Granite")





