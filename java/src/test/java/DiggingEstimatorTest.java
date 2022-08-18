import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DiggingEstimatorTest {

    @Test
    void tunnel() {
        var estimator = new DiggingEstimator(); // Works if you replace call to the service by [0, 3, 5.5, 7]
        var result = estimator.tunnel(28, 2, "GRANITE");
        assertEquals(48, result.total);
    }
}