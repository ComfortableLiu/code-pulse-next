import { IRouteItem } from "../type";

const encryption: IRouteItem = {
  path: '/encryption',
  name: '加解密',
  key: 'encryption',
  notComponent: true,
  children: [{
    path: '/sha',
    name: 'SHA加密',
    key: 'sha',
    meta: {
      seoHead: {
        title: 'SHA加密工具 - Code Pulse',
        description: '在线SHA加密工具，支持SHA-1、SHA-256、SHA-512以及HMAC-SHA加密算法，帮助开发者快速进行数据加密处理',
        keywords: 'SHA加密,SHA-1,SHA-256,SHA-512,HMAC-SHA,数据加密,在线加密工具'
      }
    }
  }, {
    path: '/symmetric',
    name: '对称加密',
    key: 'symmetric',
    meta: {
      seoHead: {
        title: '对称加密工具 - Code Pulse',
        description: '在线对称加密工具，支持AES、DES、RC4、Rabbit、TripleDes加密算法，帮助开发者快速进行数据加密解密处理',
        keywords: '对称加密,AES,DES,RC4,Rabbit,TripleDes,数据加密,在线加密工具'
      }
    }
  }, {
    path: '/asymmetric',
    name: '非对称加密',
    key: 'asymmetric',
    meta: {
      seoHead: {
        title: '非对称加密工具 - Code Pulse',
        description: '在线非对称加密工具，支持RSA、DSA、ECC、DH加密算法，提供公钥私钥生成、加密解密、数字签名等功能',
        keywords: '非对称加密,RSA,DSA,ECC,DH,公钥私钥,数字签名,密钥交换,在线加密工具'
      }
    }
  }, {
    path: '/js-eval',
    name: 'JS Eval 加解密',
    key: 'js-eval',
    meta: {
      seoHead: {
        title: 'JS Eval 加解密工具 - Code Pulse',
        description: '在线 JS Eval 加解密工具，支持 JavaScript 代码的 eval 加密和解密，帮助开发者进行简单的代码混淆处理',
        keywords: 'JS加密,eval加密,JavaScript混淆,代码加密,在线加密工具'
      }
    }
  }]
}

export default encryption;
