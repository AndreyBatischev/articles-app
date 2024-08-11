import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Like, Repository } from 'typeorm';
import { Articles } from './entities/articles.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { stringify } from 'querystring';
import { User } from '../user/entities/users.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles)
    private articlesRepository: Repository<Articles>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    author?: string;
    publicationDate?: string;
  }): Promise<Articles[]> {
    const { page = 1, limit = 10, author, publicationDate } = query;

    const cacheKey = `articles_${stringify(query)}`;
    const cachedArticles = await this.cacheManager.get<Articles[]>(cacheKey);
    if (cachedArticles) {
      return cachedArticles;
    }

    const options: FindManyOptions<Articles> = {
      skip: (page - 1) * limit,
      take: limit,
      where: {},
    };

    if (author) {
      options.where['autor'] = Like(`%${author}%`);
    }

    if (publicationDate) {
      const startOfDay = new Date(publicationDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(publicationDate);
      endOfDay.setHours(23, 59, 59, 999);

      options.where['publicatedDate'] = Between(startOfDay, endOfDay);
    }

    const articles = await this.articlesRepository.find(options);
    await this.cacheManager.set(cacheKey, articles, 60);

    return articles;
  }

  async findOne(id: string): Promise<Articles> {
    const cacheKey = `article_${id}`;
    const cachedArticle = await this.cacheManager.get<Articles>(cacheKey);
    if (cachedArticle) {
      return cachedArticle;
    }
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    await this.cacheManager.set(cacheKey, article, 60);

    return article;
  }

  async create(createArticleDto: CreateArticleDto): Promise<Articles> {
    const user = await this.userRepository.findOne({ where: { id: createArticleDto.userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const article = this.articlesRepository.create(createArticleDto);

    const savedArticle = await this.articlesRepository.save(article);
    await this.cacheManager.del('all_articles');
    return savedArticle;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Articles> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDto);
    const updatedArticles = await this.articlesRepository.save(article);
    await this.cacheManager.del('all_articles');
    await this.cacheManager.del(`article_${id}`);
    return updatedArticles;
  }

  async remove(id: string): Promise<string> {
    const article = await this.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    await this.articlesRepository.remove(article);
    await this.cacheManager.del('all_articles');
    await this.cacheManager.del(`article_${id}`);
    return `Article with ID ${id} success delete`;
  }
}
