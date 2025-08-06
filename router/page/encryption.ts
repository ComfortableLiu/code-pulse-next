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
  }]
}

export default encryption
