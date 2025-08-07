import { NextApiRequest, NextApiResponse } from 'next';
import { createApiHandler } from '@utils/apiHandler';

/**
 * 示例受保护的API端点
 * 使用createApiHandler自动包装签名验证逻辑
 */
export default createApiHandler({
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // 处理GET请求逻辑
      return res.status(200).json({
        code: 200,
        message: 'GET请求成功',
        data: {
          timestamp: new Date().toISOString(),
          query: req.query,
        },
      });
    } catch (error) {
      console.error('处理GET请求时出错:', error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误',
      });
    }
  },

  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // 处理POST请求逻辑
      const { message } = req.body;

      return res.status(200).json({
        code: 200,
        message: 'POST请求成功',
        data: {
          receivedMessage: message,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('处理POST请求时出错:', error);
      return res.status(500).json({
        code: 500,
        message: '服务器内部错误',
      });
    }
  },
});
