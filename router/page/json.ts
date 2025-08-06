import { IRouteItem } from "../type";

const jsonRoutes: IRouteItem = {
  name: 'JSON',
  key: 'json',
  path: '/json',
  notComponent: true,
  children: [{
    path: '/format',
    key: 'format',
    name: 'JSON格式化',
    meta: {
      seoHead: {
        title: 'JSON格式化工具 - Code Pulse',
        description: '在线JSON格式化工具，帮助开发者美化、校验和格式化JSON数据，提高代码可读性',
        keywords: 'JSON格式化,JSON美化,JSON校验,JSON解析,在线工具'
      }
    }
  }, {
    path: '/json2TypeScript',
    key: 'json2TypeScript',
    name: 'JSON转Typescript',
    meta: {
      seoHead: {
        title: 'JSON转TypeScript工具 - Code Pulse',
        description: '在线JSON转TypeScript工具，自动将JSON数据结构转换为TypeScript接口定义，提高开发效率',
        keywords: 'JSON转TypeScript,TypeScript接口生成,JSON解析,TypeScript工具'
      }
    }
  }]
}

export default jsonRoutes
