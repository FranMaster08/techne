import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadController } from './disponibilidad.controller';

describe('DisponibilidadController', () => {
  let controller: DisponibilidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibilidadController],
    }).compile();

    controller = module.get<DisponibilidadController>(DisponibilidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
