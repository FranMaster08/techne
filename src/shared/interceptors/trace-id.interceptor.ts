import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const req = ctx.switchToHttp().getRequest();
        const res = ctx.switchToHttp().getResponse();
        const traceId = (req as any).id;
        if (traceId) res.setHeader('X-Trace-Id', traceId);
        return next.handle();
    }
}