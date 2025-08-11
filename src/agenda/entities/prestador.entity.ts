
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prestador')
export class Prestador {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 120 })
    nombre: string;

    @Column()
    zonaHoraria: string;

    @Column({ type: 'int', default: 30 })
    duracionBloqueMin: number;
}
