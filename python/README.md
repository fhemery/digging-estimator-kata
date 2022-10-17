# Starter seed : Python - Pytest - Pytest-coverage

Uses :
* __Pip__ as build system
* __Pytest__ as unit testing engine
* __Python unittest__ as mocking framework
* __Pytest-coverage__ as coverage engine

## Installation

Once you have created your virtual environment :

> pip install -r requirements.txt

## Running the test

> pytest

At first launch, one test should pass, the other should fail

## Getting coverage

> pytest --cov=src

## Launch mutation testing

> mutatest -s src