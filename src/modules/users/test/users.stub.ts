import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export const NewUserStub = (): CreateUserDto => {
  return {
    email: 'test@user.com',
    name: 'Test User',
    password: '12345678',
    phone: '012345678',
  };
};

export const UserStub = (): User => {
  return {
    id: 1,
    email: 'test@user.com',
    name: 'Test User',
    password: '12345678',
    roles: [],
    phone: '012345678',
  };
};

export const UpdateUserStub = (): UpdateUserDto => {
  return {
    name: 'Updated User',
  };
};

export const UpdatedUserStub = (): User => {
  return {
    id: 1,
    email: 'test@user.com',
    name: 'Updated User',
    password: '12345678',
    roles: [],
    phone: '012345678',
  };
};
