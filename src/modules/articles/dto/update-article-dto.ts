import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/modules/user/entities/users.entity';

export class UpdateArticleDto {
  @ApiProperty({
    title: 'Заголовок статьи',
    example: 'Самая крутая статья'
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    title: 'Текст статьи',
    example: 'Какой то умный текст о важных вещах'
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    title: 'Автор статьи',
    example: 'Лев Толстой'
  })
  @IsNotEmpty()
  @IsString()
  autor: string;

  @ApiProperty({
    title: 'Дата публикации статьи',
    example: '10.08.2024, 16:53:14'
  })
  @IsNotEmpty()
  @IsDate()
  publicatedDate: Date;

  @ApiProperty({
    title: 'Id пользователя',
    example: '90aad9e6-ac6c-4da8-897d-34023bee7d0c',
  })
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
