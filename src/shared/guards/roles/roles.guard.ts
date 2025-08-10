// src/shared/guards/roles/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';

import { IS_PUBLIC_KEY, ROLES_KEY } from '../../decorators/roles/roles.decorator';

import { Role } from '../../enums/roles/role.enum';

type UserLike =
  | { role?: Role | number }
  | { roles?: Array<Role | string>; role?: string | number };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectPinoLogger(RolesGuard.name) private readonly logger: PinoLogger,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getHandler();
    const klass = ctx.getClass();

    // Rutas públicas saltan RBAC
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, klass]);
    if (isPublic) return true;

    // Roles requeridos
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [handler, klass]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const res = ctx.switchToHttp().getResponse();
    const user = req.user as UserLike | undefined;

    // ✅ Normaliza roles del usuario correctamente
    const userRoles: string=  (user.role as string).toLowerCase() ; 

    const allowed = requiredRoles.map((r) => String(r).toLowerCase());
    const hasAccess = [userRoles].some((r) => allowed.includes(r));

    if (!user || !hasAccess) {
      const traceId = req?.id ?? randomUUID(); // usa el id de pino si existe
      res?.setHeader?.('X-Trace-Id', traceId);

      this.logger.warn(
        {
          traceId,
          path: req.url,
          method: req.method,
          requiredRoles: allowed,
          userRoles,
          userId: (user as any)?.sub ?? null,
          reason: !user ? 'missing_user' : 'role_not_allowed',
        },
        'RBAC denied',
      );

      throw new ForbiddenException({ message: 'Sin permisos para acceder a este recurso', traceId });
    }

    this.logger.debug(
      {
        traceId: req?.id ?? randomUUID(),
        path: req.url,
        method: req.method,
        requiredRoles: allowed,
        userRoles,
        userId: (user as any)?.sub ?? null,
      },
      'RBAC allowed',
    );

    return true;
  }
}