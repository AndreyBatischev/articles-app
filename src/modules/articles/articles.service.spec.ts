import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { Repository } from 'typeorm';
import { Articles } from './entities/articles.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from '../user/entities/users.entity';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articlesRepository: Repository<Articles>;
  let userRepository: Repository<User>;
  let cacheManager: Cache;

  const CACHE_MANAGER = 'CACHE_MANAGER';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Articles),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),  
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get<Repository<Articles>>(getRepositoryToken(Articles));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });
  //create
  it('should throw NotFoundException if user is not found', async () => {
    const createNewArticleDto = {
        userId: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
        title: 'New Article',
        body: 'Some body',
        autor: 'Test',
        publicatedDate: new Date()
      };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(articlesRepository, 'create').mockReturnValue({} as Articles);
    jest.spyOn(articlesRepository, 'save').mockReturnValue(Promise.resolve({} as Articles));

    await expect(service.create(createNewArticleDto)).rejects.toThrow(NotFoundException);

    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: createNewArticleDto.userId } });
    expect(articlesRepository.create).not.toHaveBeenCalled();
    expect(articlesRepository.save).not.toHaveBeenCalled();
    expect(cacheManager.del).not.toHaveBeenCalled();
  });

  it('should create an article if user exists', async () => {
    const createNewArticleDto = {
        userId: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
        title: 'New Article',
        body: 'Some body',
        autor: 'Test',
        publicatedDate: new Date(),
        createdAt: new Date()
      };

    const user = new User();
    user.id = createNewArticleDto.userId
    user.name = createNewArticleDto.autor

    let article = new Articles();
    article = { id: '326bf49b-037b-442e-a1e1-a1e1cb11ae1d' , ...createNewArticleDto, user }

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(articlesRepository, 'create').mockReturnValue(article);
    jest.spyOn(articlesRepository, 'save').mockReturnValue(Promise.resolve(article));
    jest.spyOn(cacheManager, 'del').mockResolvedValue(undefined);

    const result = await service.create(createNewArticleDto)
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: createNewArticleDto.userId } });
    expect(articlesRepository.create).toHaveBeenCalledWith(createNewArticleDto);
    expect(articlesRepository.save).toHaveBeenCalledWith(article);
    expect(cacheManager.del).toHaveBeenCalledWith('all_articles');
  })
  //create end
  
  //findOne
  it('should return an article from cache if it exists', async () => {
    const id = '90aad9e6-ac6c-4da8-897d-34023bee7d0c';
    const cachedArticle = new Articles();
    cachedArticle.id = id;

    jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedArticle);

    const result = await service.findOne(id);

    expect(result).toEqual(cachedArticle);
    expect(cacheManager.get).toHaveBeenCalledWith(`article_${id}`);
  });

  it('should return an article from the database if not in cache', async () => {
    const id = '90aad9e6-ac6c-4da8-897d-34023bee7d0c';
    const article = new Articles();
    article.id = id;

    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(articlesRepository, 'findOne').mockResolvedValue(article);
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

    const result = await service.findOne(id);

    expect(result).toEqual(article);
    expect(cacheManager.get).toHaveBeenCalledWith(`article_${id}`);
    expect(articlesRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(cacheManager.set).toHaveBeenCalledWith(`article_${id}`, article, 60);
  });

  it('should throw NotFoundException if article is not found', async () => {
    const id = '90aad9e6-ac6c-4da8-897d-34023bee7d0c';

    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(articlesRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    expect(cacheManager.get).toHaveBeenCalledWith(`article_${id}`);
    expect(articlesRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(cacheManager.set).not.toHaveBeenCalled();
  });  
  //findOne end
});
