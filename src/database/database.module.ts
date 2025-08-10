import { OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '5432')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        // migrations: ['src/migrations/*.ts'],
        synchronize: false, // Solo para desarrollo
        // Opciones de pool de conexiones
        extra: {
          // Número máximo de conexiones en el pool
          max: parseInt(config.get<string>('DB_POOL_MAX', '10')),
          // Tiempo que una conexión puede estar inactiva antes de cerrarse (en ms)
          idleTimeoutMillis: parseInt(config.get<string>('DB_IDLE_TIMEOUT', '30000')),
        },
      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly dataSource: DataSource) { }

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('Database connected');
    }
  }
}
