import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/users.entity';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should hash the password and create a user', async () => {
    const createUserDto = {
      name: 'admin',
      email: 'testuser2@asd.com',
      password: 'asdasdasd',
    };

    const savedUser = { ...createUserDto } as User;
    savedUser.password = await bcrypt.hash(savedUser.password, 10);

    jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

    const result = await service.create(savedUser);

    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

  it('should return all users', async () => {
    const users = [
      {
        id: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
        name: 'User One',
        email: 'testuser1@asd.com',
      },
      {
        id: '555bf49b-037b-442e-a1e1-a1e1cb11ae1a',
        name: 'User Two',
        email: 'testuser2@asd.com',
      },
    ] as User[];

    jest.spyOn(userRepository, 'find').mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(userRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return a user by id with related articles', async () => {
    const user = {
      id: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
      name: 'User One',
      email: 'testuser2@asd.com',
      articles: [],
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const result = await service.findOne(
      '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
    );

    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d' },
      relations: ['articles'],
    });
  });

  it('should update a user and return the updated user', async () => {
    const id = '726bf49b-037b-442e-a1e1-a1e1cb11ae1d';
    const updateUserDto = {
      name: 'Updated User',
      password: 'asdasdasd',
    };

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    const updatedUser = {
      ...updateUserDto,
    } as User;

    jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
    jest.spyOn(service, 'findOne').mockResolvedValue(updatedUser);

    const result = await service.update(id, updatedUser);

    expect(userRepository.update).toHaveBeenCalledWith(id, {
      ...updatedUser,
    });
    expect(result).toEqual(updatedUser);
  });

  it('should remove user by id', async () => {
    const id = '726bf49b-037b-442e-a1e1-a1e1cb11ae1d';

    jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

    await service.remove(id);

    expect(userRepository.delete).toHaveBeenCalledWith(id);
  });

  it('should return a user by email', async () => {
    const email = 'testuser2@asd.com';
    const user = {
      id: '726bf49b-037b-442e-a1e1-a1e1cb11ae1d',
      name: 'User One',
      email,
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const result = await service.findByEmail(email);

    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
  });
});
