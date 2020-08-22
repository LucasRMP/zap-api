import DataLoader = require('dataloader');
import { getRepository } from 'typeorm';

import User from '../entities/user.entity';

export const batchUsers = async (ids: number[]) => {
  const UserRepo = getRepository(User);
  const users = await UserRepo.findByIds(ids);

  return users;
};

const getUserLoader = () => new DataLoader(batchUsers);

export { getUserLoader };
