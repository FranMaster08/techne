import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt/jwt.guard';
import { RolesGuard } from './shared/guards/roles/roles.guard';
import { LoggingModule } from './logging/logging.module';
import { JwtAuthModule } from './jwt/jwt.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    LoggingModule,
    JwtAuthModule, // Import JWT module for authentication
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_GUARD, useClass: JwtAuthGuard }, // 1) Autenticación
    // { provide: APP_GUARD, useClass: RolesGuard },   // 2) Autorización (roles)
  ],
})
export class AppModule { }
