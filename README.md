# Toy robot 
### Description 
The Toy robot is a simulation of a Toy that can move on a table with a pre defined dimensions. 
The movement of the Toy robot is restricited by the dimensions of the surface of the table.   

### Application 
This is an interactive CLI application.  

### Requirments
* Node version >= 16.x

### Setup 
First, clone the repository from [github.com/Tochukz/toy-robot](https://github.com/Tochukz/toy-robot) and install it's dependencies. 
```
$ git clone https://github.com/Tochukz/toy-robot.git
$ cd toy-robot
$ npm install 
```
Next, start the CLI 
```
$ npm run start:cli
```  

### Operation 
First, start the CLI application 
```
$ npm run start:cli
```  
Then you issue your first command.   
Your first command must be a PLACE command which is in the format `place x,y,north`. For example:
```
> place 0,0,north
``` 
This puts the Robot at position(x=0, y=0) and facing north.  
Subsequently, you can enter any other valid command including another place command: 
```
> left 
> move 
> report
``` 

To exit the application, you issue the exit command 
```
$ exit
```
Or press ctrl+C to exit.   

#### Valid command
Commands are of two categories
1. __Place__: A place command puts the Robot on a given position on the table. For example `place 2,3,west` puts the robot at position(x=2, y=3) and facing west.  
2. __Action__: An action command which could be any of the following: 
  * `left`: Turns the robot in the anti-clockwise direction with respect to the cardinal directions.
  * `right`:  Turns the robot in the clockwise direction with respect to the cardinal directions.
  * `report`: Ouputs the current position to the screen in the form X,Y,CardinalDirection e.g `2,3,WEST`
  * `move`: Moves the robot by 1 unit in it's current facing cardinal direction within the bounds of the table dimension.  Move commands that are beyound the bounds of the table dimensions are ignored.  

Note that commands are case insensitive.  

### Production 
To generate a production build you can run the build command 
```
$ npm run build
```

### Test 
To run the test cases
```
$ npm run test 
```