import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { LoginDto } from './dto/login.dto';

import { Role } from '../shared/enums/roles/role.enum';
import { LoginResponseDto, AuthUserDto } from './dto/login-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersService: UserService,
    @InjectPinoLogger(AuthService.name) private readonly logger: PinoLogger,
  ) { }

  /** Genera un traceId para correlación */
  private newTraceId(): string {
    return randomUUID();
  }

  /** Login con trazabilidad y errores HTTP con traceId */
  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, email: dto.email }, 'Intento de login');
    this.logger.debug({ traceId }, 'Buscando usuario por email');

    try {
      // Obtiene la ENTIDAD con passwordHash (select:false en la entidad)
      const user = await this.usersService.findByEmail(dto.email, true);

      if (!user || user.isActive === false) {
        this.logger.warn({ traceId, email: dto.email }, 'Email no encontrado o inactivo');
        throw new UnauthorizedException({
          message: 'Credenciales inválidas',
          traceId,
        });
      }

      const passwordHash: string = user.password;
      const ok = passwordHash ? await bcrypt.compare(dto.password, passwordHash) : false;

      if (!ok) {
        this.logger.error({ traceId, userId: user.id }, 'Password inválida');
        throw new UnauthorizedException({
          message: 'Credenciales inválidas',
          traceId,
        });
      }

      const role: Role = user.role ?? Role.User;
      const payload = { sub: String(user.id), email: user.email, role };

      const access_token = await this.jwt.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRES || '1d',
        secret: process.env.JWT_SECRET,
      });

      this.logger.info({ traceId, userId: user.id, role }, 'Token emitido correctamente');

      return {
        access_token,
        token_type: 'Bearer',
        user: { id: String(user.id), email: user.email, role } as AuthUserDto,
      };
    } catch (err: any) {
      if (err?.getStatus) {
        this.logger.warn({ traceId, err: err?.message }, 'Error controlado en login');
        throw err;
      }
      this.logger.error({ traceId, err }, 'Error no controlado en login');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }

  /** Construye el perfil desde el payload (sin errores esperables) */
  profileFromPayload(payload: { sub: string; email: string; role: Role }): MeResponseDto {
    const traceId = this.newTraceId();
    this.logger.debug({ traceId, userId: payload.sub }, 'Construyendo perfil desde payload');
    return { id: payload.sub, email: payload.email, role: payload.role };
  }

  /** Solo para desarrollo: emitir token con rol arbitrario (con traceId en logs) */
  async loginAs(role: Role): Promise<LoginResponseDto> {
    const traceId = this.newTraceId();
    this.logger.info({ traceId, role }, 'Emitir token DEV por rol');

    try {
      const payload = { sub: 'dev-user-id', email: `dev+${role}@example.com`, role };
      const access_token = await this.jwt.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRES || '1d',
        secret: process.env.JWT_SECRET,
      });

      this.logger.info({ traceId, role }, 'Token DEV emitido');
      return { access_token, token_type: 'Bearer', user: this.profileFromPayload(payload) };
    } catch (err: any) {
      this.logger.error({ traceId, err }, 'Fallo emitiendo token DEV');
      throw new InternalServerErrorException({ message: 'Error interno del servidor', traceId });
    }
  }
}