// src/agenda/entities/cita.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('cita')
@Index(['prestadorId', 'inicioUtc'])
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'prestador_id' })
  prestadorId: string;

  @Column({ name: 'inicio_utc', type: 'timestamptz' })
  inicioUtc: Date;

  @Column({ name: 'fin_utc', type: 'timestamptz' })
  finUtc: Date;

  @Column({ name: 'nombre_cliente', length: 160 })
  nombreCliente: string;

  @Column({ name: 'email_cliente', length: 160, nullable: true })
  emailCliente?: string;

  @Column({ name: 'telefono_cliente', length: 32, nullable: true })
  telefonoCliente?: string;

  @Column({ default: 'RESERVADA' })
  estado: 'RESERVADA' | 'CANCELADA';

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn: Date;
}
