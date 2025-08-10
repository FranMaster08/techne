
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
} from 'typeorm';
import { Role } from '../../shared/enums/roles/role.enum';

@Entity({ name: 'users' })
@Check(`"birth_date" IS NULL OR "birth_date" <= CURRENT_DATE`)
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 , nullable: true })
  name?: string;

  @Column({ length: 100 })
  lastName: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: Date | null;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'int' })
  documentTypeId: number;

  @Column({ length: 32 })
  documentNumber: string;

  @Column({ length: 32 })
  cellphone: string;

  @Column({ length: 160 })
  address: string;

  @Column({ name: 'passwordHash', length: 72 })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}