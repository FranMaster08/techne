// src/agenda/dto/listar-citas-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class ListarCitasQueryDto {
    @ApiPropertyOptional({ description: 'ID del prestador' })
    @IsUUID()
    prestadorId: string;

    @ApiPropertyOptional({ description: 'Fecha exacta (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    fecha?: string;

    @ApiPropertyOptional({ description: 'Desde (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    desde?: string;

    @ApiPropertyOptional({ description: 'Hasta (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    hasta?: string;
}
