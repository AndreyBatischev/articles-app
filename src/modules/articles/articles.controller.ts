import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ArticlesService } from './articles.service';
import { Articles } from './entities/articles.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';
import { FindAllDto } from './dto/find-all-article-dto';

@ApiTags('articles')
@Controller({ path: 'articles', version: '1' })
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Article has been successfully created.',
    type: Articles,
  })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of articles with pagination and filtering.',
    type: [Articles],
  })
  findAll(@Query() filterParams?: FindAllDto) {
    return this.articleService.findAll(filterParams);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Article found.', type: Articles })
  @ApiNotFoundResponse({ description: 'Article not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Article has been successfully updated.',
    type: Articles,
  })
  @ApiNotFoundResponse({ description: 'Article not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Article has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Article not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.articleService.remove(id);
  }
}
