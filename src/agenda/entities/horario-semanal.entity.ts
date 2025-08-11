// src/agenda/entities/horario-semanal.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('horario_semana')
@Index(['prestadorId', 'diaSemana'])
export class HorarioSemanal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'prestador_id' })
    prestadorId: string;

    @Column({ name: 'dia_semana', type: 'int' }) // 0=Dom ... 6=Sáb
    diaSemana: number;

    @Column({ name: 'hora_inicio', type: 'time' })
    horaInicio: string; // local

    @Column({ name: 'hora_fin', type: 'time' })
    horaFin: string; // local
}
