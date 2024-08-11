import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthLoginUserDto } from './dto/auth-login-dto';
import { User } from '../user/entities/users.entity';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User has been successfully registered.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User has been successfully logged in.',
    type: String,
  }) // Возвращается токен (строка)
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async login(@Body() loginDto: AuthLoginUserDto) {
    const validatedUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(validatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User profile has been successfully retrieved.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getProfile(@Request() req) {
    return req.user;
  }
}
