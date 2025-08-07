import { NextRequest, NextFetchEvent } from 'next/server';
import { verifySignature, generateNonce } from '@utils/signature';

// 密钥 - 在实际项目中应该从环境变量中获取
const SECRET_KEY = process.env.API_SECRET_KEY || 'your-secret-key';

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // 只处理API路由的请求
  if (request.nextUrl.pathname.startsWith('/api')) {
    // 如果是开发环境，可以选择跳过签名验证
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_SIGNATURE_VERIFICATION === 'true') {
      return undefined; // 继续处理请求
    }

    try {
      // 获取请求头中的签名相关信息
      const signature = request.headers.get('x-signature');
      const timestampStr = request.headers.get('x-timestamp');
      const nonce = request.headers.get('x-nonce');

      // 检查必要参数
      if (!signature || !timestampStr || !nonce) {
        return new Response(
          JSON.stringify({
            code: 400,
            message: '缺少签名参数',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const timestamp = parseInt(timestampStr);

      // 检查时间戳是否过期（5分钟内有效）
      const now = Date.now();
      if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
        return new Response(
          JSON.stringify({
            code: 400,
            message: '请求已过期',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // 获取请求体数据
      // 注意：在Next.js中间件中读取请求体比较复杂，需要特殊处理
      // 这里简化处理，实际项目中可能需要调整

      // 验证签名的逻辑应该在API路由中完成，因为需要完整的请求体数据
      // 中间件中只做基础检查，具体的签名验证交给API路由处理
    } catch (error) {
      console.error('签名验证错误:', error);
      return new Response(
        JSON.stringify({
          code: 500,
          message: '签名验证异常',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // 继续处理请求
  return undefined;
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有API路由
     */
    '/api/:path*',
  ],
};
