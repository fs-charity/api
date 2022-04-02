import { UpdatedUserStub, UserStub } from '../test/users.stub';

export const UsersService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(UserStub()),
  findAll: jest.fn().mockResolvedValue([UserStub()]),
  findOne: jest.fn().mockResolvedValue(UserStub()),
  updateOne: jest.fn().mockResolvedValue(UpdatedUserStub()),
  removeOne: jest.fn().mockResolvedValue({ message: 'User has been deleted' }),
});
