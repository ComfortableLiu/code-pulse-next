import { NextApiRequest, NextApiResponse } from 'next';
import { withSignatureVerification } from './signatureMiddleware';

// API路由处理器类型
type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

// HTTP方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

// API路由配置
interface ApiRouteConfig {
  [key: string]: ApiHandler;
}

/**
 * 创建API路由处理器，自动包装签名验证逻辑
 * @param config API路由配置
 * @returns Next.js API路由处理器
 */
export function createApiHandler(config: ApiRouteConfig) {
  // 包装所有处理器添加签名验证
  const wrappedConfig: ApiRouteConfig = {};

  Object.keys(config).forEach(method => {
    wrappedConfig[method] = withSignatureVerification(config[method]);
  });

  // 返回Next.js API路由处理器
  return (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as HttpMethod;

    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Signature, X-Timestamp, X-Nonce');

    // 处理OPTIONS预检请求
    if (method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // 检查是否存在对应HTTP方法的处理器
    if (wrappedConfig[method]) {
      return wrappedConfig[method](req, res);
    } else {
      // 不支持的HTTP方法
      res.status(405).json({
        code: 405,
        message: `不支持的请求方法: ${method}`,
      });
    }
  };
}
