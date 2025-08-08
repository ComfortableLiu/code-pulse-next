import { IAnyObj } from "@utils/type";

export class JwtUtils {
  /**
   * 生成JWT Token
   * @param payload 载荷数据
   * @param secretKey 密钥
   * @param expiresIn 过期时间
   * @returns JWT Token
   */
  static generateToken(payload: IAnyObj, secretKey: string, expiresIn: string): string {
    // 这里应该使用实际的JWT库，如jsonwebtoken
    // 为了演示目的，我们使用简化实现
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    let exp = now;

    // 解析过期时间
    if (expiresIn.endsWith('m')) {
      exp += parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('h')) {
      exp += parseInt(expiresIn) * 3600;
    } else if (expiresIn.endsWith('d')) {
      exp += parseInt(expiresIn) * 86400;
    } else {
      exp += parseInt(expiresIn);
    }

    const fullPayload = {
      ...payload,
      iat: now,
      exp: exp
    };

    // Base64编码
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
    const encodedPayload = btoa(JSON.stringify(fullPayload)).replace(/=/g, '');

    // 简化的签名（实际应使用HMAC SHA256算法）
    const signature = btoa(`${encodedHeader}.${encodedPayload}.${secretKey}`).replace(/=/g, '');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * 解码头部
   * @param token JWT Token
   * @returns 解码后的头部
   */
  static decodeHeader(token: string): IAnyObj {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');

      const header = atob(parts[0]);
      return JSON.parse(header);
    } catch (error) {
      throw new Error('Failed to decode header');
    }
  }

  /**
   * 解码载荷
   * @param token JWT Token
   * @returns 解码后的载荷
   */
  static decodePayload(token: string): IAnyObj {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');

      const payload = atob(parts[1]);
      return JSON.parse(payload);
    } catch (error) {
      throw new Error('Failed to decode payload');
    }
  }

  /**
   * 验证JWT Token
   * @param token JWT Token
   * @param secretKey 密钥
   * @returns 是否验证通过
   */
  static verifyToken(token: string, secretKey: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const [header, payload, signature] = parts;
      const expectedSignature = btoa(`${header}.${payload}.${secretKey}`).replace(/=/g, '');

      return signature === expectedSignature;
    } catch (error) {
      return false;
    }
  }
}
