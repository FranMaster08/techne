// src/agenda/agenda.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { Prestador } from './entities/prestador.entity';
import { HorarioSemanal } from './entities/horario-semanal.entity';
import { HorarioEspecial } from './entities/horario-especial.entity';
import { Cita } from './entities/cita.entity';



import { LoggingModule } from 'src/logging/logging.module';
import { CitasController } from './citas/citas.controller';
import { CitasService } from './citas/citas.service';
import { DisponibilidadController } from './disponibilidad/disponibilidad.controller';
import { DisponibilidadService } from './disponibilidad/disponibilidad.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestador, HorarioSemanal, HorarioEspecial, Cita]),
      LoggerModule.forRoot(),
  ],
  controllers: [DisponibilidadController, CitasController],
  providers: [DisponibilidadService, CitasService],
  exports: [],
})
export class AgendaModule { }
