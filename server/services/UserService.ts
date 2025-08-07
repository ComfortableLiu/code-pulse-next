import { UserModel } from '@models/UserModel';
import { User } from '@entities/User';

export class UserService {
  private userModel = new UserModel();

  async registerUser(username: string, email: string, password: string): Promise<User> {
    // 业务逻辑：检查用户是否已存在
    const existingUser = await this.userModel.findUserByUsername(username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 业务逻辑：密码加密（示例中简化处理）
    const encryptedPassword = this.encryptPassword(password);

    // 创建用户
    return await this.userModel.createUser({
      username,
      email,
      password: encryptedPassword,
    });
  }

  async getUserProfile(userId: number): Promise<User | null> {
    return await this.userModel.findUserById(userId);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.findAllUsers();
  }

  private encryptPassword(password: string): string {
    // 实际项目中应使用 bcrypt 等加密库
    return password.split('').reverse().join(''); // 简单示例，不要在生产中使用
  }
}
