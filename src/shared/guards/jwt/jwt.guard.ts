import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const traceId = req?.id;
    const logger = req?.logger ?? console;
    if (err || !user) {
      logger.warn({ traceId, err: err?.message, info: info?.message }, 'JWT guard denied');
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user; // <-- attach a req.user
  }
}