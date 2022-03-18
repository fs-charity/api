import { PrismaService } from '@app/db';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { NewUserStub, UpdateUserStub } from './users.stub';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let newUser = NewUserStub();

  let updateUser = UpdateUserStub();
  let user: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    await prismaService.cleanDatabase();
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    describe('when creating user', () => {
      beforeEach(async () => {
        user = await service.create(newUser);
      });

      test('user should be created', () => {
        expect(user.email).toBe(newUser.email);
      });
    });

    describe('when creating duplicate user', () => {
      it('should throw on duplicate email', async () => {
        try {
          await service.create(newUser);
        } catch (error) {
          expect(error.code).toBe('P2002');
        }
      });
    });
  });

  describe('findAll()', () => {
    describe('when getting all the user', () => {
      let users: User[];

      beforeEach(async () => {
        users = await service.findAll();
      });

      test('should get all users', () => {
        expect(users.length).toBeGreaterThan(0);
      });
    });
  });

  describe('findOne()', () => {
    describe('when getting specific user', () => {
      let _user: User;

      beforeEach(async () => {
        _user = await service.findOne(user.id);
      });

      test('should get the specific user', () => {
        expect(_user.id).toBe(user.id);
      });
    });
  });

  describe('updateOne()', () => {
    describe('when updating specific user', () => {
      beforeEach(async () => {
        user = await service.updateOne(user.id, updateUser);
      });

      test('should change the user info', () => {
        expect(user.name).toBe(updateUser.name);
      });
    });
  });

  describe('removeOne()', () => {
    describe('when deleting specific user', () => {
      it('should delete the user', async () => {
        let result = await service.removeOne(user.id);
        expect(result.message).toBe('User has been deleted');
      });
    });

    describe('when deleting invalid user', () => {
      it('should throw an error', async () => {
        try {
          await service.removeOne(user.id);
        } catch (error) {
          expect(error.code).toBe('P2025');
        }
      });
    });
  });
});
