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

    def test_max_dw_miner_dt(self):
        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        result = estimator.tunnel(28, 2, "Granite")
        assert result.day_team.miners == 3

    def test_max_dw_miner_nt(self):
        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        result = estimator.tunnel(28, 2, "Granite")
        assert result.night_team.miners == 3

    def test_min_dw_miner_dt(self):
        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        result = estimator.tunnel(20, 2000, "Granite")
        assert result.day_team.miners == 0

    def test_min_dw_miner_dn(self):
        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        result = estimator.tunnel(20, 2000, "Granite")
        assert result.night_team.miners == 0


    def test_max_dw_compo_total_dt(self):
        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        result = estimator.tunnel(28, 2, "Granite")
        total_dt = result.day_team.miners + result.day_team.healers + result.day_team.smithies + result.day_team.lighters + result.day_team.inn_keepers + result.day_team.guards + result.day_team.guard_managers + result.day_team.washers
        assert total_dt == 16

    def test_max_dw_compo_total_nt(self):
        estimator = DiggingEstimator()
        estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
        result = estimator.tunnel(28, 2, "Granite")
        total_nt = result.night_team.miners + result.night_team.healers + result.night_team.smithies + result.night_team.lighters + result.night_team.inn_keepers + result.night_team.guards + result.night_team.guard_managers + result.night_team.washers
        assert total_nt == 32








