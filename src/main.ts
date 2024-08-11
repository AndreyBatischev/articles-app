import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const host = configService.get<string>('host') || 'localhost';

  app.setGlobalPrefix('api');
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const nodeEnv = configService.get<string>('NODE_ENV');
  if (nodeEnv !== 'production') {
    createSwagger(app);
    console.log(`Swagger documentation is available at http://${host}:${port}/docs/api`);
  }

  await app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`);
  });
}
bootstrap();
