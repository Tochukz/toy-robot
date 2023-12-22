import { Module } from '@nestjs/common';
import { RobotSimulatorModule } from './robot-simulator/robot-simulator.module';

@Module({
  imports: [RobotSimulatorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
