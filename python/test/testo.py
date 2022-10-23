from python.src.digging_estimator import *

from unittest.mock import MagicMock


def max_digging():

    estimator = DiggingEstimator()
    estimator.get = MagicMock(return_value=[0, 3, 5.5, 7])
    result = estimator.tunnel(28, 2, "Granite")
    print()

max_digging()