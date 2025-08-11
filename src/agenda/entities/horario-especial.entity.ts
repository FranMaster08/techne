// src/agenda/entities/horario-especial.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('horario_especial')
@Index(['prestadorId', 'fecha'])
export class HorarioEspecial {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'prestador_id' })
    prestadorId: string;

    @Column({ type: 'date' })
    fecha: string; // local

    @Column({ default: true })
    cerrado: boolean;

    @Column({ name: 'inicio_especial', type: 'time', nullable: true })
    inicioEspecial?: string | null;

    @Column({ name: 'fin_especial', type: 'time', nullable: true })
    finEspecial?: string | null;
}
