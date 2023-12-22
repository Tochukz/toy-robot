import { RobotSimulatorCommand } from './robot-simulator.command';
import { IPosition } from 'src/interfaces/iposition';
import { ICommand } from 'src/interfaces/icommand';

describe('RobotSimulatorCommand', () => {
  let robotSimulatorCommand;
  beforeEach(async () => {
    robotSimulatorCommand = new RobotSimulatorCommand();
    robotSimulatorCommand.loggingMethod = 'variable';
    robotSimulatorCommand.parseInput('place 0,0,north');
  });

  afterEach(async () => {
    robotSimulatorCommand.parseInput('exit');
  });

  it('robotSimulatorCommand should be defined', () => {
    expect(robotSimulatorCommand).toBeDefined();
  });

  it('toy should be facing north at 0,0', () => {
    const { x, y, facing } = robotSimulatorCommand.position;
    expect(x).toBe(0);
    expect(y).toBe(0);
    expect(facing).toBe('north');
  });

  describe('exitTerminal', () => {
    it('should log "Thank you" message to the screen', () => {
      robotSimulatorCommand.exitTerminal();
      expect(
        robotSimulatorCommand.latestLog.includes('Thank you'),
      ).toBeTruthy();
    });
  });

  describe('parseInput', () => {
    it('should log invalid input and return undefined', () => {
      const input = 'anything';
      const result = robotSimulatorCommand.parseInput(input);
      expect(robotSimulatorCommand.latestLog).toBe(
        `Invalid command: "${input}". Please try again.`,
      );
      expect(result).toBeUndefined();
    });
    it('should parse "place" input and return a command object with place', () => {
      const input = 'place 3,1,east';
      const command = robotSimulatorCommand.parseInput(input);
      expect(command.place.facing).toBe('east');
      expect(command.place.x).toBe(3);
      expect(command.place.y).toBe(1);
    });
    it('should parse "move" input and return a command object with action', () => {
      const input = 'move';
      const command = robotSimulatorCommand.parseInput(input);
      expect(command.action).toBe(input);
    });
    it('should parse "left" input regardless of case i.e case insensitive', () => {
      const input = 'LeFt';
      const command = robotSimulatorCommand.parseInput(input);
      expect(command.action).toBe('left');
    });
  });

  describe('executeCommand', () => {
    it('should execute place command', () => {
      jest.spyOn(robotSimulatorCommand, 'place').mockImplementation();
      const command: ICommand = {
        place: {
          x: 1,
          y: 2,
          facing: 'west',
        },
      };
      robotSimulatorCommand.executeCommand(command);
      expect(robotSimulatorCommand.place).toBeCalledWith(command.place);
    });
    it('should execute action command', () => {
      jest.spyOn(robotSimulatorCommand, 'action').mockImplementation();
      const command: ICommand = { action: 'move' };
      robotSimulatorCommand.executeCommand(command);
      expect(robotSimulatorCommand.action).toBeCalledWith(command.action);
    });
  });

  describe('place', () => {
    it('should ignore position if x is exceeds the x-bounds(0 -5) of the table', () => {
      const currentPosition = robotSimulatorCommand.getPosition();
      const position: IPosition = { x: 7, y: 2, facing: 'north' };
      const place = robotSimulatorCommand.place(position);
      expect(currentPosition.x).toBe(0);
      expect(currentPosition.y).toBe(0);
      expect(place.x).toBe(0);
      expect(place.y).toBe(0);
    });
    it('should discard position if y is exceeds the y-bounds(0-5) of the table', () => {
        const currentPosition = robotSimulatorCommand.getPosition();
        const position: IPosition = { x: 2, y: 9, facing: 'north' };
        const place = robotSimulatorCommand.place(position);
        expect(currentPosition.x).toBe(0);
        expect(currentPosition.y).toBe(0);
        expect(place.x).toBe(0);
        expect(place.y).toBe(0);
      });
    it('should place a valid position', () => {
      const position: IPosition = { x: 3, y: 2, facing: 'north' };
      const place = robotSimulatorCommand.place(position);
      expect(place.x).toBe(3);
      expect(place.y).toBe(2);
    });
  });

  describe('action', () => {
    it('should call the move method', () => {
      jest.spyOn(robotSimulatorCommand, 'move').mockImplementation();
      robotSimulatorCommand.action('move');
      expect(robotSimulatorCommand.move).toBeCalled();
    });
    it('should call the turnLeft method', () => {
        jest.spyOn(robotSimulatorCommand, 'turnLeft').mockImplementation();
        robotSimulatorCommand.action('left');
        expect(robotSimulatorCommand.turnLeft).toBeCalled();
    });
    it('should call the turnRight method', () => {
        jest.spyOn(robotSimulatorCommand, 'turnRight').mockImplementation();
        robotSimulatorCommand.action('right');
        expect(robotSimulatorCommand.turnRight).toBeCalled();
    });
    it('should call the report method', () => {
        jest.spyOn(robotSimulatorCommand, 'report').mockImplementation();
        robotSimulatorCommand.action('report');
        expect(robotSimulatorCommand.report).toBeCalled();
    });
  });

  describe('move', () => {
    it('should move y coordinate by 2 units', () => {
      const currentPosition = robotSimulatorCommand.getPosition();
      const position = robotSimulatorCommand.move();
      const finalPosition = robotSimulatorCommand.move();
      expect(currentPosition.y).toBe(0);
      expect(position.y).toBe(1);
      expect(finalPosition.y).toBe(2);
    });
  });

  describe('turnLeft', () => {
    it('should change facing cardinal point in anti-clockwise direction', () => {
      const currentPosition = robotSimulatorCommand.getPosition();
      const position = robotSimulatorCommand.turnLeft();
      const finalPosition = robotSimulatorCommand.turnLeft();
      expect(currentPosition.facing).toBe('north');
      expect(position.facing).toBe('west');
      expect(finalPosition.facing).toBe('south');
    });
  });

  describe('turnRight', () => {
    it('should change facing cardinal point in clockwise direction', () => {
      const currentPosition = robotSimulatorCommand.getPosition();
      const position = robotSimulatorCommand.turnRight();
      const finalPosition = robotSimulatorCommand.turnRight();
      expect(currentPosition.facing).toBe('north');
      expect(position.facing).toBe('east');
      expect(finalPosition.facing).toBe('south');
    });
  });

  describe('report', () => {
    it('should log the current position', () => {
      const position = robotSimulatorCommand.report();
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
      expect(position.facing).toBe('north');
    });
  });

  describe('getPosition', () => {
    it('should return current position', () => {
      const position = robotSimulatorCommand.getPosition();
      expect(position.x).toBe(0);
      expect(position.y).toBe(0);
      expect(position.facing).toBe('north');
    });
  });

  describe('log', () => {
    it('should log text to variable', () => {
        const text = 'Hello CLI';
        robotSimulatorCommand.log(text);
        expect(robotSimulatorCommand.latestLog).toBe(text);
    });
  });

  describe('logline', () => {
    it('should log text to variable', () => {
        const text = 'Hello CLI';
        robotSimulatorCommand.logline(text);
        expect(robotSimulatorCommand.latestLog).toBe(text);
    });
  });
});
