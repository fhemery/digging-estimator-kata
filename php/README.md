# PHP - PHP Unit

This uses :
* __PHP 8__ as interpreter
* __PHPUnit__ for tests
* __Composer__ for package management

## Installing

You need a working PHP version, and [composer](https://getcomposer.org/) installed

Just run:
> composer install

## Running the tests
Your IDE should be able to launch the tests easily, but if you want to launch from command line:
> ./vendor/bin/phpunit tests

## Getting coverage
You will need XDebug installed an configured, see [here](https://www.lambdatest.com/blog/phpunit-code-coverage-report-html/) for more info (article for Windows)
> ./vendor/bin/phpunit --coverage-html coverage --coverage-filter src tests
