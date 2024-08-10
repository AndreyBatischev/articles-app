import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Like, Repository } from 'typeorm';
import { Articles } from './entities/articles.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles)
    private articlesRepository: Repository<Articles>,
  ) { }

  async findAll(query: { page?: number; limit?: number; author?: string; publicationDate?: string }): Promise<Articles[]> {
    const { page = 1, limit = 10, author, publicationDate } = query;

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

    return this.articlesRepository.find(options);
  }

  async findOne(id: string): Promise<Articles> {
    const article = await this.articlesRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async create(createArticleDto: CreateArticleDto): Promise<Articles> {
    const article = this.articlesRepository.create(createArticleDto);
    return this.articlesRepository.save(article);
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Articles> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDto);
    return this.articlesRepository.save(article);
  }

  async remove(id: string): Promise<void> {
    const article = await this.findOne(id);
    await this.articlesRepository.remove(article);
  }
}