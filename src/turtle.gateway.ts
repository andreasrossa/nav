import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export type TurtleEventType = 'move' | 'turn' | 'scan';
export type TurtleMoveDirection = 'forward' | 'backward';
export type TurtleTurnDirection = 'left' | 'right';

export type TurtleMoveEvent = TurtleEvent<{
  direction: TurtleMoveDirection;
}> & {
  event: 'move';
};

export type TurtleTurnEvent = TurtleEvent<{
  direction: TurtleTurnDirection;
}> & {
  event: 'turn';
};

export type TurtleScanEvent = TurtleEvent<{
  front: any;
  up: any;
  down: any;
}> & {
  event: 'scan';
};

export type TurtleEvents = TurtleTurnEvent | TurtleMoveEvent | TurtleScanEvent;

export type TurtleEvent<T = any> = {
  event: TurtleEventType;
  data: T;
};

@WebSocketGateway(80)
export class TurtleGateway
  implements
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>,
    OnGatewayInit
{
  queue: TurtleEvents[] = [];

  constructor() {
    for (let i = 0; i < 10; i++) {
      this.queue.push({
        event: 'move',
        data: {
          direction: 'forward',
        },
      });
      this.queue.push({
        event: 'turn',
        data: {
          direction: 'left',
        },
      });
    }
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('TurtleGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client?.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client?.id}`);
  }

  @SubscribeMessage('scan_cool')
  handleScan(client: Socket, payload: any): any {
    this.logger.log(JSON.stringify(payload));
    return {
      event: 'scan_received',
      data: {},
    };
  }

  @SubscribeMessage('request_op')
  handleRequestOp(client: Socket, payload: any): any {
    this.logger.log(`Returning new op (Queue now at ${this.queue.length})`);
    return this.queue.pop();
  }
}
