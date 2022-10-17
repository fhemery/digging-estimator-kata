from src.digging_estimator import DiggingEstimator


def test_returns_as_doctor_Pockosky_says():
    estimator = DiggingEstimator()

    result = estimator.tunnel(28, 2, "granite")

    assert result.total == 48
