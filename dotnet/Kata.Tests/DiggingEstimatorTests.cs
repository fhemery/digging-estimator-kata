using System.Collections.Generic;
using Xunit;

namespace Kata.Tests;

public class DiggingEstimatorTests
{
    [Fact]
    public void Should_WorkAsDrPockovskySaid()
    {
        var estimator = new DiggingEstimator();
        var result = estimator.Tunnel(28, 2, "Granite");
        Assert.Equal(48, result.Total);
    }
}