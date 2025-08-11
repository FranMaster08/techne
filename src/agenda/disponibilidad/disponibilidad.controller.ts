// src/agenda/disponibilidad.controller.ts
import { Controller, Get, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { DisponibilidadService } from './disponibilidad.service';

import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles/roles.decorator';
import { Role } from 'src/shared/enums/roles/role.enum';
import { DisponibilidadQueryDto } from '../dto/disponibilidad-query.dto';

@ApiTags('Agenda - Disponibilidad')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Sin permisos' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disponibilidad')
export class DisponibilidadController {
    constructor(private readonly service: DisponibilidadService) { }

    @ApiOperation({ summary: 'Consultar horarios libres', description: 'Devuelve slots libres por rango (sin guardar slots).' })
    @ApiOkResponse({ description: 'Disponibilidad devuelta' })
    @ApiBadRequestResponse({ description: 'Parámetros inválidos' })
    @Roles(Role.Admin) // Solo Admin
    @Get()
    @HttpCode(200)
    async consultar(@Query() q: DisponibilidadQueryDto) {
        return this.service.consultar(q);
    }
}
