using System.Collections.Generic;
using Xunit;

namespace Kata.Tests;

public class HelloTests
{
    [Fact]
    public void Should_Work() {
        Assert.Equal(3, 1 + 2);
    }

    [Fact]
    public void Should_Fail()
    {
        var hello = new Hello();
        Assert.Equal("Hello world!", hello.print());
    }
}