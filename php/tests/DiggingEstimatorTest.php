<?php

use kata\DiggingEstimator;
use PHPUnit\Framework\TestCase;

class DiggingEstimatorTest extends TestCase
{

    public function testShouldWork() : void {
        $estimator = new DiggingEstimator();
        $result = $estimator->tunnel(28, 2, "Granite"); // Works if you manually put [0, 3, 5.5, 7] for the rates

        $this->assertEquals(48, $result->total);
    }

}
