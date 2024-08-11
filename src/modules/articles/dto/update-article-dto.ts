import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    title: 'Заголовок статьи',
    example: 'Самая крутая статья',
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    title: 'Текст статьи',
    example: 'Какой то умный текст о важных вещах',
  })
  @IsOptional()
  @IsString()
  body: string;

  @ApiProperty({
    title: 'Дата публикации статьи',
    example: '10.08.2024, 16:53:14',
  })
  @IsOptional()
  @IsDate()
  publicatedDate: Date;
}
