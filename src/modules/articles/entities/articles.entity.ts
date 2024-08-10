import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { IsDate, IsNotEmpty } from 'class-validator';
import { User } from 'src/modules/user/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('articles')
export class Articles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    title: 'Заголовок статьи',
    example: 'Самая крутая статья'
  })
  @Column()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    title: 'Текст статьи',
    example: 'Какой то умный текст о важных вещах'
  })
  @Column()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    title: 'Автор статьи',
    example: 'Лев Толстой'
  })
  @Column()
  @IsNotEmpty()
  autor: string;

  @ApiProperty({
    title: 'Дата публикации статьи',
    example: '10.08.2024, 16:53:14'
  })
  @Column()
  @IsDate()
  publicatedDate: Date;

  @ApiProperty({
    title: 'Дата создания статьи',
    example: '10.08.2024, 16:53:14'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;
}
