import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

const isProd = process.env.NODE_ENV === 'production';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level: process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug'),
                autoLogging: true,
                genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
                customProps: (req) => ({
                    traceId: (req as any).id,
                    userId: (req as any).user?.sub ?? null,
                }),
                redact: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token', '*.secret'],
                ...(isProd ? {} : {
                    transport: {
                        target: 'pino-pretty',
                        options: { singleLine: true, colorize: true, translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l' },
                    },
                }),
            },
        }),
    ],
    exports: [LoggerModule],
})
export class LoggingModule { }