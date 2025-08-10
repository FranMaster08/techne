// src/shared/guards/ownership/self-or-admin.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../../enums/roles/role.enum';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;              // { sub, email, role }
        const paramId = req.params?.id;     // asumimos :id en la ruta

        if (!user) return false;
        if (user.role === Role.Admin) return true;               // Admin siempre puede
        if (paramId == null) return false;

        // Permite si el usuario es dueño del recurso
        return String(user.sub) === String(paramId);
    }
}