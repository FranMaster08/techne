import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional, IsString, IsEnum, IsBoolean, IsInt, Min, Max, IsIn, IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../../shared/enums/roles/role.enum';

// helper: null/'' -> undefined
const nullishToUndef = ({ value }: { value: any }) =>
  value === null || value === '' ? undefined : value;

export class UserListQueryDto {
  @ApiPropertyOptional({ description: 'Nombre contiene (case-insensitive)', example: 'juan' })

  @IsOptional() 
  name?: string;

  @ApiPropertyOptional({ description: 'Email contiene (case-insensitive)', example: '@example.com' })

  @IsOptional() 
  email?: string;

  @ApiPropertyOptional({ description: 'Rol del usuario', enum: Role, example: Role.Admin })

  @IsOptional() 
  role?: Role;

  @ApiPropertyOptional({ description: 'Solo activos/inactivos', example: true })
  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Desde fecha de nacimiento (YYYY-MM-DD)', example: '1990-01-01', format: 'date' })

  @IsOptional() 
  birthDateFrom?: string;


  @IsOptional() 
  birthDateTo?: string;

  @ApiPropertyOptional({ description: 'Tipo de documento', example: 1 })

  @IsOptional()
  documentTypeId?: number;

  // Paginación (si llega null, lo ignoramos y en el service ya tienes defaults)
  @ApiPropertyOptional({ description: 'Página', example: 1, default: 1 })
  @IsOptional() 
  page?: number;

  @ApiPropertyOptional({ description: 'Tamaño de página', example: 20, default: 20, maximum: 100 })
  @Transform(({ value }) => (value === null || value === '' ? undefined : Number(value)))
  @IsOptional() 
  limit?: number;

  @ApiPropertyOptional({ description: 'Campo de orden', enum: ['name','email','createdAt','birthDate'], default: 'createdAt' })

  @IsOptional()
  sortBy?: 'name' | 'email' | 'createdAt' | 'birthDate';

  @ApiPropertyOptional({ description: 'Dirección de orden', enum: ['ASC','DESC'], default: 'DESC' })

  @IsOptional() @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}