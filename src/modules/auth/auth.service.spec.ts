import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/entities/users.entity';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return a JWT token when login is successful', async () => {
    const user = {
      id: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
      email: 'testuser@test.com',
    } as User;
    const token = 'mocked-jwt-token';

    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await service.login(user);

    expect(jwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: user.id,
    });
    expect(result).toEqual({ bearer_token: token });
  });

  it('should call userService.create when registering a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'testuser@test.com',
      password: 'asdasd',
    };
    const createdUser = {
      id: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
      ...createUserDto,
    } as User;

    jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

    const result = await service.register(createUserDto);

    expect(userService.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(createdUser);
  });
});
