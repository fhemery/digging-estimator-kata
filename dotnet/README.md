# Starter seed: Dotnet 6 - XUnit - Moq

Uses: 
* __XUnit__ as the unit test framework
* __Moq__ as the mocking framework

## Installing

This starter uses dotnet 6. If you have not installed it, you can get it from [Dotnet download page](https://dotnet.microsoft.com/en-us/download)

## Running tests

Your IDE can generally do it, but if you need command line:

> dotnet test

The first time you run it, one of the tests should fail.

## Coverage

Better ask your IDE for it, it's much simpler, but if you feel brave, you first need to install a report generator: 
> dotnet tool install -g dotnet-reportgenerator-globaltool

Then run the test with coverage gathering __from the `Kata/Tests` folder__:
> dotnet test --collect:"XPlat Code Coverage"

A `TestResults folder` should have appeared with a guid. Then run: 
> reportgenerator -reports:"TestResults\{guid}\coverage.cobertura.xml" -targetdir:"TestResults/coveragereport" -reporttypes:Html