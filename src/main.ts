import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TraceIdInterceptor } from './shared/interceptors/trace-id.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.useGlobalInterceptors(new TraceIdInterceptor());
  // main.ts
  const config = new DocumentBuilder()
    .setTitle('Techne API')
    .setDescription('...')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Desarrollo Local')
    .addServer('https://api.techne.example.com', 'Servidor de Producción')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'bearer', // 👈 mismo nombre que usas en @ApiBearerAuth('bearer')
    )
    // opcional: que todos los endpoints requieran bearer por defecto
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // recuerda el token entre refresh
    },
  });

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
