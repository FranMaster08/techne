// src/agenda/dto/crear-cita.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsInt, Min, IsString, IsOptional, IsEmail } from 'class-validator';

export class CrearCitaDto {
    @ApiProperty({ description: 'ID del prestador (UUID)' })
    @IsUUID()
    prestadorId: string;

    @ApiProperty({ description: 'Inicio de la cita (ISO-8601 UTC), ej: 2025-08-12T08:30:00Z' })
    @IsDateString()
    inicio: string;

    @ApiProperty({ description: 'Duración en minutos (múltiplo de la duración del prestador)' })
    @IsInt()
    @Min(5)
    duracionMinutos: number;

    @ApiProperty({ description: 'Nombre del cliente' })
    @IsString()
    nombreCliente: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    emailCliente?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    telefonoCliente?: string;
}
