import { NextApiRequest, NextApiResponse } from 'next';
import { verifySignature } from './signature';

// 密钥 - 在实际项目中应该从环境变量中获取
const SECRET_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';

/**
 * 签名验证中间件
 * @param handler
 * @returns
 */
export function withSignatureVerification(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 如果是开发环境，可以选择跳过签名验证
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_SIGNATURE_VERIFICATION === 'true') {
      return handler(req, res);
    }

    try {
      // 获取请求头中的签名相关信息
      const signature = req.headers['x-signature'] as string;
      const timestamp = parseInt(req.headers['x-timestamp'] as string);
      const nonce = req.headers['x-nonce'] as string;

      // 检查必要参数
      if (!signature || !timestamp || !nonce) {
        return res.status(400).json({
          code: 400,
          message: '缺少签名参数',
        });
      }

      // 检查时间戳是否过期（5分钟内有效）
      const now = Date.now();
      if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
        return res.status(400).json({
          code: 400,
          message: '请求已过期',
        });
      }

      // 验证签名
      const isValid = verifySignature(req.body || {}, timestamp, nonce, signature, SECRET_KEY);

      if (!isValid) {
        return res.status(401).json({
          code: 401,
          message: '签名验证失败',
        });
      }

      // 签名验证通过，继续处理请求
      return handler(req, res);
    } catch (error) {
      console.error('签名验证错误:', error);
      return res.status(500).json({
        code: 500,
        message: '签名验证异常',
      });
    }
  };
}
