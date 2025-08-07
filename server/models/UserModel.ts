import { User } from '@entities/User';
import { getDataSource } from "@lib/db";

export class UserModel {

  async getRepository() {
    return (await getDataSource()).getRepository(User)
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = (await this.getRepository()).create(userData);
    return await (await this.getRepository()).save(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return await (await this.getRepository()).findOne({ where: { id } });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await (await this.getRepository()).findOne({ where: { username } });
  }

  async findAllUsers(): Promise<User[]> {
    return await (await this.getRepository()).find();
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    await (await this.getRepository()).update(id, userData);
    return await this.findUserById(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await (await this.getRepository()).delete(id);
    return result.affected !== 0;
  }
}
