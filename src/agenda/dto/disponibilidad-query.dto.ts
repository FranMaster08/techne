// src/agenda/dto/disponibilidad-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class DisponibilidadQueryDto {
    @ApiPropertyOptional({ description: 'ID del prestador (UUID)' })
    @IsUUID()
    prestadorId: string;

    @ApiPropertyOptional({ description: 'Desde (YYYY-MM-DD) en zona del prestador' })
    @IsDateString()
    desde: string;

    @ApiPropertyOptional({ description: 'Hasta (YYYY-MM-DD) en zona del prestador' })
    @IsDateString()
    hasta: string;

    @ApiPropertyOptional({ description: 'Cortar desde esta hora (ISO-8601 UTC) en el primer día' })
    @IsOptional()
    @IsDateString()
    desdeHora?: string;

    @ApiPropertyOptional({ description: 'Límite opcional de slots a devolver (primero(s))' })
    @IsOptional()
    @IsInt()
    @Min(1)
    limite?: number;
}
