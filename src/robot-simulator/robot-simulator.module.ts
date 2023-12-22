import { Module } from '@nestjs/common';
import { RobotSimulatorCommand } from './robot-simulator.command';

@Module({
  providers: [ RobotSimulatorCommand ]
})
export class RobotSimulatorModule {}
