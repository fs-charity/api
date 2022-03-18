import { PrismaService } from '@app/db';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersController } from '../users.controller';
import {
  NewUserStub,
  UpdatedUserStub,
  UpdateUserStub,
  UserStub,
} from './users.stub';
import { User } from '../entities/user.entity';

jest.mock('../users.service');

describe('UserController', () => {
  let usersController: UsersController;
  let prismaService: PrismaService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await usersService.create(NewUserStub());
      });

      test('then it should call userService.create', () => {
        expect(usersService.create).toBeCalledWith(NewUserStub());
      });

      test('then it should return a user', () => {
        expect(user).toEqual(UserStub());
      });
    });
  });
  describe('findAll', () => {
    describe('when findAll is called', () => {
      let users: User[];

      beforeEach(async () => {
        users = await usersService.findAll();
      });

      test('then it should call userService.findAll', () => {
        expect(usersService.findAll).toBeCalled();
      });

      test('then it should return a list of users', () => {
        expect(users).toEqual([UserStub()]);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let user: User;
      let id = UserStub().id;

      beforeEach(async () => {
        user = await usersService.findOne(id);
      });

      test('then it should call userService.findOne', () => {
        expect(usersService.findOne).toBeCalledWith(id);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(UserStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('when updateOne is called', () => {
      let user: User;
      let id = UserStub().id;

      beforeEach(async () => {
        user = await usersService.updateOne(id, UpdateUserStub());
      });

      test('then it should call userService.updateOne', () => {
        expect(usersService.updateOne).toBeCalledWith(id, UpdateUserStub());
      });

      test('then it should return an updated user', () => {
        expect(user).toEqual(UpdatedUserStub());
      });
    });
  });

  describe('removeOne', () => {
    describe('when removeOne is called', () => {
      let id = UserStub().id;

      beforeEach(async () => {
        await usersService.removeOne(id);
      });

      test('then it should call userService.removeOne', () => {
        expect(usersService.removeOne).toBeCalled();
      });
    });
  });
});
