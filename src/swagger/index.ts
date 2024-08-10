import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import * as packageJson from '../../package.json';

config();

const configService = new ConfigService();

export const SWAGGER_PATH = configService.get<string>('SWAGGER_PATH', '/docs/api');

const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Enter JWT token',
            in: 'header',
        },
        'access-key', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

export function createSwagger(app: INestApplication): INestApplication {
    const login = configService.get<string>('SWAGGER_LOGIN');
    const password = configService.get<string>('SWAGGER_PASS');

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PATH, app, document);
    return app;
}
