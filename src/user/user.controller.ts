
import {
  Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Query,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse,
  ApiBadRequestResponse, ApiNotFoundResponse, ApiBearerAuth, ApiUnauthorizedResponse,
  ApiForbiddenResponse, ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto-responses/user-response.dto';

import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles/roles.decorator';
import { Role } from 'src/shared/enums/roles/role.enum';
import { SelfOrAdminGuard } from 'src/shared/guards/roles/self-or-admin.guard';
import { UserListQueryDto } from './dto/user-list-query.dto';

@ApiTags('Usuarios')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Sin permisos' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Crear un usuario', description: 'Crea un nuevo usuario en el sistema.' })
  @ApiCreatedResponse({ description: 'Usuario creado exitosamente', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Error al crear usuario' })
  @Roles(Role.Admin) // Solo Admin
  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Lista de usuarios con filtros opcionales, paginación y orden.',
  })
  @ApiOkResponse({ description: 'Listado de usuarios', type: UserResponseDto, isArray: true })
  // Docs de query (opcionales)
  @ApiQuery({ name: 'name', required: false, description: 'Nombre contiene (case-insensitive)' })
  @ApiQuery({ name: 'email', required: false, description: 'Email contiene (case-insensitive)' })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'birthDateFrom', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'birthDateTo', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'documentTypeId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Por defecto 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Por defecto 20 (máx 100)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'email', 'createdAt', 'birthDate'], description: 'Campo de orden' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Dirección de orden' })
  @Roles(Role.Admin) // Solo Admin
  @Get()
  async findAll(@Query() q: UserListQueryDto): Promise<UserResponseDto[]> {
    return await this.userService.findAll(q);
  }

  @ApiOperation({ summary: 'Obtener un usuario por id', description: 'Admin o el propio usuario.' })
  @ApiOkResponse({ description: 'Usuario encontrado', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @Roles(Role.Admin, Role.User) // Admin o el propio usuario
  @UseGuards(JwtAuthGuard, RolesGuard, SelfOrAdminGuard) 
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.userService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar un usuario por id', description: 'Admin o el propio usuario.' })
  @ApiOkResponse({ description: 'Usuario actualizado', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiBadRequestResponse({ description: 'Error al actualizar usuario' })
  @UseGuards(JwtAuthGuard, RolesGuard, SelfOrAdminGuard) 
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario por id', description: 'Solo Admin.' })
  @ApiNoContentResponse({ description: 'Usuario eliminado correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @Roles(Role.Admin) // Solo Admin
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(+id);
  }
}