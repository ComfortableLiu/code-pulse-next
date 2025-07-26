import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { Observable } from 'rxjs';
import { IAnyObj } from "../type";

@Injectable()
export class SignatureInterceptor implements NestInterceptor {
  // 签名有效时间（毫秒），5分钟
  private readonly MAX_TIME_DIFF = 5 * 60 * 1000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    //签名字段
    const receivedSignature = request.header('x-signature');
    const timestamp = parseInt(request.header('x-timestamp') || '');

    // 基本头信息验证
    if (!receivedSignature || !timestamp) {
      throw new UnauthorizedException('Missing required headers');
    }

    // 验证时间有效性
    const now = Date.now();
    if (Math.abs(now - timestamp) > this.MAX_TIME_DIFF) {
      throw new UnauthorizedException('Request expired');
    }

    // 生成服务端签名
    const serverSignature = this.generateServerSignature(request, timestamp);

    // 安全比较签名（防时序攻击）
    if (!this.safeCompare(receivedSignature, serverSignature)) {
      throw new UnauthorizedException('Invalid signature');
    }

    return next.handle();
  }

  /**
   * 生成服务端签名
   * @param request 请求
   * @param timestamp 事件戳
   * @private 生成的签名
   */
  private generateServerSignature(request: Request, timestamp: number): string {
    // 获取环境变量中的密钥
    const secret = process.env.SIGNATURE_SECRET || '';

    const params: IAnyObj = {
      timestamp,
      // nonce,
      method: request.method,
      path: request.path || '',
      query: request.query || {},
      body: request.body || {}
    };

    // 过滤并排序参数
    const sortedParams: IAnyObj = {};
    Object.keys(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .filter(key => key !== 'signature') // 排除签名本身
      .forEach(key => {
        sortedParams[key] = params[key];
      });

    // 构造待签名字符串
    const signStr = Object.entries(sortedParams)
      .map(([key, value]) => {
        // 处理嵌套对象
        if (typeof value === 'object' && value !== null) {
          return `${key}=${JSON.stringify(value)}`;
        }
        return `${key}=${value}`;
      })
      .join('&');

    // 生成HMAC-SHA256签名
    return createHmac('sha256', secret)
      .update(signStr)
      .digest('hex');
  }

  // 安全字符串比较（防时序攻击）
  private safeCompare(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    return bufferA.length === bufferB.length &&
      timingSafeEqual(bufferA, bufferB);
  }
}
