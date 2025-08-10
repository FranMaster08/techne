// src/user/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  IsEnum,
  Length,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../shared/enums/roles/role.enum';

// helper: null/'' -> undefined (por si viene vacío en peticiones)
const nullishToUndef = ({ value }: { value: any }) =>
  value === null || value === '' ? undefined : value;

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mín. 8 caracteres)',
    example: 'Secr3to123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento (YYYY-MM-DD)',
    example: '1990-05-21',
    type: String,
    format: 'date',
  })
  @Transform(nullishToUndef)
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: Role,
    example: Role.Admin,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: 1,
    type: Number,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  documentTypeId: number;

  @ApiProperty({
    description: 'Número de documento',
    example: '11564612',
  })
  @IsString()
  @Length(4, 32) // entidad: length 32
  documentNumber: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+43123456789',
  })
  @IsString()
  @Length(5, 32) // entidad: length 32
  cellphone: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle 123 #45-67',
  })
  @IsString()
  @Length(3, 160) // entidad: length 160
  address: string;
}