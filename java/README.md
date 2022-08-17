# Starter seed : Java - JUnit - Jacoco

Uses :
* __Gradle__ as build system
* __JUnit__ as unit testing engine
* __Mockito__ as mocking framework. Check [Mockito doc](https://javadoc.io/doc/org.mockito/mockito-junit-jupiter/latest/org/mockito/junit/jupiter/MockitoExtension.html) for more details
* __Jacoco__ as reporting engine

## Installation

Windows: 
> gradlew.bat build

Others: 
> ./gradlew build

## Running the test

Your IDE can do it for you. 

Else, for Windows: 
> gradlew.bat test

For others: 
> ./gradlew test

Whenever tests are green, Jacoco will run and output them in `build/reports/jacoco`