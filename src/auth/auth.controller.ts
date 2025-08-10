import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { LoginResponseDto } from './dto/login-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { LoginAsDto } from './dto/login-as.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectPinoLogger(AuthController.name) private readonly logger: PinoLogger,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login con email/password (JWT)' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const traceId = (req as any).id;
    this.logger.info({ traceId, email: dto.email, ip: req.ip }, 'Intento de login');
    this.logger.debug({ traceId }, 'Validando credenciales');
    const result = await this.authService.login(dto);
    this.logger.info({ traceId, userId: result.user.id }, 'Login exitoso');
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: MeResponseDto })
  me(@Req() req: Request): MeResponseDto {
    const traceId = (req as any).id;
    const user = (req as any).user;
    this.logger.debug({ traceId, userId: user?.sub }, 'Consulta de perfil');
    return this.authService.profileFromPayload(user);
  }

  @Post('login-as') // solo dev
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[DEV] Emitir token con un rol dado' })
  @ApiBody({ type: LoginAsDto })
  @ApiOkResponse({ type: LoginResponseDto })
  async loginAs(@Body() dto: LoginAsDto, @Req() req: Request): Promise<LoginResponseDto> {
    const traceId = (req as any).id;
    if (process.env.NODE_ENV === 'production') {
      this.logger.warn({ traceId }, 'login-as bloqueado en producción');
      throw new (await import('@nestjs/common')).ForbiddenException('No disponible en producción');
    }
    this.logger.info({ traceId, role: dto.role }, 'Emitir token dev por rol');
    return this.authService.loginAs(dto.role);
  }
}