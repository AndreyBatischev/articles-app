import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import path from 'path';

ConfigModule.forRoot({
    isGlobal: true,
});

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [path.join(__dirname + '/../**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname + '/migrations/*{.ts,.js}')],
    synchronize: false,
});
