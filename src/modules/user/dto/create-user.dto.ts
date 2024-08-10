import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    title: 'Имя пользователя',
    example: 'admin',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: 'Email пользователя',
    example: 'testuser2@asd.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'Пароль',
    example: 'asdasdasd',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
