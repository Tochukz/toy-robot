import * as readline from 'readline';
import { Command, CommandRunner } from 'nest-commander';
import { IPosition } from 'src/interfaces/iposition';
import {
  Action,
  CardinalDirection,
  LogginMethod,
} from 'src/interfaces/common-types';
import { ICommand } from 'src/interfaces/icommand';

@Command({
  name: 'robot',
  options: {
    isDefault: true,
  },
})
export class RobotSimulatorCommand extends CommandRunner {
  rd: readline.Interface;

  position: IPosition = { x: 5, y: 5, facing: '' };

  cardinalDirections: CardinalDirection[] = ['north', 'east', 'south', 'west'];

  tableDimension = [5, 5]; //[x, y]

  latestLog = '';

  loggingMethod: LogginMethod = 'console';

  constructor() {
    super();

    const rd = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.parseInput = this.parseInput.bind(this);
    this.exitTerminal = this.exitTerminal.bind(this);

    rd.on('line', this.parseInput);
    rd.on('close', this.exitTerminal);
    this.rd = rd;
  }

  exitTerminal() {
    this.logline('Thank you for using robot rover!');
  }

  async run(): Promise<void> {
    const maxX = this.tableDimension[0];
    const maxY = this.tableDimension[1];
    this.logline('Welcome to robot rover!');
    this.log(`Start with a place command: eg PLACE X,Y,NORTH where x: (0 - ${maxX}) and y: (0 - ${maxY}) \n> `);
  }

  parseInput(input: any) {
    if (input == 'exit') {
      this.rd.close();
      return;
    }
    const cmdLower = input?.toLowerCase().trim();
    const bits = cmdLower.split(',');
    const first = bits[0];
    const firstNumber = first.replace('place ', '');
    const secondNumber = bits[1];
    const facing = bits[2];
    const simpleActions: Action[] = ['move', 'left', 'right', 'report'];
    const cmd: ICommand = {
      place: null,
      action: null,
    };
    if (
      cmdLower.includes('place') &&
      !isNaN(firstNumber) &&
      !isNaN(secondNumber) &&
      this.cardinalDirections.includes(facing)
    ) {
      cmd.place = {
        x: parseInt(firstNumber),
        y: parseInt(secondNumber),
        facing,
      };
    } else if (simpleActions.includes(cmdLower)) {
      cmd.action = cmdLower;
    } else {
      this.logline(`Invalid command: "${input}". Please try again.`);
      this.write('> ');
      return;
    }
    this.executeCommand(cmd);
    return cmd;
  }

  executeCommand(cmd: ICommand) {
    if (cmd.action && !this.position.facing) {
      this.logline('Please start with a place command, e.g PLACE 0,0,NORTH');
      return;
    }
    if (cmd.place) {
      this.place(cmd.place);
    } else {
      this.action(cmd.action);
    }
    this.write('\n> ');
  }

  place(position: IPosition): IPosition {
    const { x, y } = position;
    const maxX = this.tableDimension[0];
    const maxY = this.tableDimension[1];
    if (x < 0 || x > maxX) {
      this.logline(`x must be between 0 - ${maxX}, inclusive.`);
      return { ...this.position };
    }
    if (y < 0 || y > maxY) {
      this.logline(`y must be between 0 - ${maxY}, inclusive.`)
      return { ...this.position };
    }
    this.position = position;
    return { ...position };
  }

  action(act: Action) {
    let result;
    switch (act) {
      case 'move':
        result = this.move();
        break;
      case 'left':
        result = this.turnLeft();
        break;
      case 'right':
        result = this.turnRight();
        break;
      case 'report':
        result = this.report();
        break;
    }
    return result;
  }

  move(): IPosition {
    const position = this.position;
    const { x, y, facing } = position;
    const [xMax, yMax] = this.tableDimension;
    if (facing == 'north' && y < yMax) {
      position.y = position.y + 1;
    } else if (facing == 'south' && y > 0) {
      position.y = position.y - 1;
    } else if (facing == 'west' && x > 0) {
      position.x = position.x - 1;
    } else if (facing == 'east' && x < xMax) {
      position.x = position.x + 1;
    }
    return { ...position };
  }

  turnLeft(): IPosition {
    const position = this.position;
    const cardinalDirections = this.cardinalDirections;
    const index = cardinalDirections.findIndex(
      (cardr) => cardr == position.facing,
    );
    if (index > 0) {
      position.facing = cardinalDirections[index - 1];
    } else {
      position.facing = cardinalDirections[cardinalDirections.length - 1];
    }
    return { ...position };
  }

  turnRight(): IPosition {
    const position = this.position;
    const cardinalDirections = this.cardinalDirections;
    const index = cardinalDirections.findIndex(
      (cardr) => cardr == position.facing,
    );
    if (index < cardinalDirections.length - 1) {
      position.facing = cardinalDirections[index + 1];
    } else {
      position.facing = cardinalDirections[0];
    }
    return { ...position };
  }

  report(): IPosition {
    this.logline(this.position);
    return this.position;
  }

  getPosition(): IPosition {
    return { ...this.position };
  }

  write(text: string) {
    if (this.loggingMethod == 'console') {
      process.stdout.write(text);
    }
  }

  log(text: string) {
    if (this.loggingMethod == 'variable') {
      this.latestLog = text;
    } else {
      process.stdout.write(text);
    }
  }

  logline(input: any) {
    if (this.loggingMethod == 'variable') {
      this.latestLog = input;
      return;
    } 
    if (typeof input == 'object') {
      const {x, y, facing} = input as IPosition
      console.log(`${x},${y},${facing?.toUpperCase()}`);
    } else {
      console.log(input)
    }
  }
}
