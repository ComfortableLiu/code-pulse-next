import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "node:path";
import databaseConfig from "../../config/configuration";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, `../config/env/.env.${process.env.NODE_ENV || 'development'}`),
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
        synchronize: config.get<boolean>('database.synchronize'),
        logging: false,
        timezone: '+08:00',
        charset: 'utf8mb4',
        connectTimeout: 20000,
      }),
    })
  ]
})
export class DatabaseModule {
}
