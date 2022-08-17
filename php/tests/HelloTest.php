<?php

use kata\Hello;
use PHPUnit\Framework\TestCase;

class HelloTest extends TestCase
{

    public function testShouldWork() : void {
        $this->assertEquals(3, 1 + 2);
    }

    public function testHello() : void {
        $hello = new Hello();
        $this->assertEquals("Hello world!", $hello->print());
    }

}
