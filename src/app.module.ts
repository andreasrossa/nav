import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TurtleGateway } from './turtle.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TurtleGateway],
})
export class AppModule {}
