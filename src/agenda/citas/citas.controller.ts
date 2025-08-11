// src/agenda/citas.controller.ts
import { Controller, Get, Post, Body, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import { CitasService } from './citas.service';

import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles/roles.decorator';
import { Role } from 'src/shared/enums/roles/role.enum';
import { CrearCitaDto } from '../dto/crear-cita.dto';
import { ListarCitasQueryDto } from '../dto/listar-citas-query.dto';

@ApiTags('Agenda - Citas')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Sin permisos' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('citas')
export class CitasController {
    constructor(private readonly service: CitasService) { }

    @ApiOperation({ summary: 'Asignar cita', description: 'Crea una cita si el horario está libre.' })
    @ApiCreatedResponse({ description: 'Cita creada' })
    @ApiBadRequestResponse({ description: 'Datos inválidos' })
    @ApiConflictResponse({ description: 'Horario no disponible' })
    @Roles(Role.Admin) // Solo Admin
    @Post()
    @HttpCode(201)
    async crear(@Body() dto: CrearCitaDto) {
        return this.service.crear(dto);
    }

    @ApiOperation({ summary: 'Listar citas', description: 'Lista citas por prestador y fecha o rango.' })
    @ApiOkResponse({ description: 'Listado de citas' })
    @Roles(Role.Admin) // Solo Admin
    @Get()
    @HttpCode(200)
    async listar(@Query() q: ListarCitasQueryDto) {
        return this.service.listar(q);
    }
}
