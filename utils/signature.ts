/**
 * 签名验证工具函数
 */
import { IAnyObj } from "@utils/type";

// 普通SHA加密
const sha = async (originalStr: string, name: '1' | '256' | '512') => {
  // 使用Web Crypto API实现SHA1加密
  const hash = await crypto.subtle
    .digest(`SHA-${name}`, new TextEncoder().encode(originalStr))
  const hashArray = Array.from(new Uint8Array(hash))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 生成签名
 * @param data 需要签名的数据
 * @param timestamp 时间戳
 * @param nonce 随机字符串
 * @param secretKey 密钥
 */
export function generateSignature(
  data: Record<string, IAnyObj>,
  timestamp: number,
  nonce: string,
  secretKey: string
) {
  // 将数据按键排序并序列化
  const sortedData = Object.keys(data)
    .sort()
    .reduce((obj: Record<string, IAnyObj>, key: string) => {
      obj[key] = data[key];
      return obj;
    }, {});

  const dataString = JSON.stringify(sortedData);

  // 构造签名字符串
  const signString = `${dataString}&timestamp=${timestamp}&nonce=${nonce}&key=${secretKey}`;

  // 使用 SHA256 生成签名
  return sha(signString, '256');
}

/**
 * 验证签名
 * @param data 需要验证的数据
 * @param timestamp 时间戳
 * @param nonce 随机字符串
 * @param signature 待验证的签名
 * @param secretKey 密钥
 */
export async function verifySignature(
  data: Record<string, IAnyObj>,
  timestamp: number,
  nonce: string,
  signature: string,
  secretKey: string
) {
  const expectedSignature = await generateSignature(data, timestamp, nonce, secretKey);
  return expectedSignature === signature;
}

/**
 * 生成随机字符串
 */
export function generateNonce(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
