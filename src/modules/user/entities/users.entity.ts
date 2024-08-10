import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Articles } from 'src/modules/articles/entities/articles.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    title: 'Имя пользователя',
    example: 'Лев'
  })
  @Column()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: 'Email',
    example: 'lev1828@tolstoy.ru'
  })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'Пароль',
    example: 'Lev_1828!'
  })
  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Articles, (article) => article.user)
  articles: Articles[];
}
