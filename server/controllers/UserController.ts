import { UserService } from '@services/UserService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createApiHandler } from '@utils/apiHandler';

export class UserController {
  private userService = new UserService();

  getAllUsers = createApiHandler({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const users = await this.userService.getAllUsers();

        return res.status(200).json({
          code: 200,
          message: '获取用户列表成功',
          data: users,
        });
      } catch (error) {
        console.error('获取用户列表失败:', error);
        return res.status(500).json({
          code: 500,
          message: '服务器内部错误',
        });
      }
    }
  });

  createUser = createApiHandler({
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const { username, email, password } = req.body;

        const user = await this.userService.registerUser(username, email, password);

        return res.status(200).json({
          code: 200,
          message: '创建用户成功',
          data: user,
        });
      } catch (error: any) {
        console.error('创建用户失败:', error);
        return res.status(400).json({
          code: 400,
          message: error.message || '创建用户失败',
        });
      }
    }
  });

  getUserById = createApiHandler({
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const { id } = req.query;
        const userId = parseInt(id as string);

        if (isNaN(userId)) {
          return res.status(400).json({
            code: 400,
            message: '无效的用户ID',
          });
        }

        const user = await this.userService.getUserProfile(userId);

        if (!user) {
          return res.status(404).json({
            code: 404,
            message: '用户不存在',
          });
        }

        return res.status(200).json({
          code: 200,
          message: '获取用户信息成功',
          data: user,
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
        return res.status(500).json({
          code: 500,
          message: '服务器内部错误',
        });
      }
    }
  });
}

// 导出控制器实例
export const userController = new UserController();
