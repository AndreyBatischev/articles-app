import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { Articles } from './entities/articles.entity';
import { ArticlesController } from './articles.controller';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articles, User]),
    CacheModule.register({
      useFactory: (configService: ConfigService) => ({
        store: typeof redisStore,
        host: configService.get<string>('REDIS_DB_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get<number>('REDIS_TTL'),
      }),
    }),
  ],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
