import { Test, TestingModule } from '@nestjs/testing';
import { TurtleGateway } from './turtle.gateway';

describe('TurtleGateway', () => {
  let gateway: TurtleGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TurtleGateway],
    }).compile();

    gateway = module.get<TurtleGateway>(TurtleGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
