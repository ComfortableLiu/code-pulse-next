import { IRouteItem } from "../type";

const formatterRoutes: IRouteItem = {
  path: '/formatter',
  name: '代码格式化',
  key: 'formatter',
  notComponent: true,
  children: [{
    path: '/js',
    name: 'JS/TS格式化',
    key: 'js-formatter',
    meta: {
      seoHead: {
        title: 'JavaScript/TypeScript代码格式化工具 - Code Pulse',
        description: '在线JavaScript/TypeScript代码格式化工具，支持JS、JSX、TS和TSX格式化，使用Prettier标准规则格式化您的代码，使其更易读和维护',
        keywords: 'JavaScript格式化,TypeScript格式化,JSX,TSX,代码格式化,Prettier,代码美化,在线工具'
      }
    }
  }, {
    path: '/html',
    name: 'HTML格式化',
    key: 'html-formatter',
    meta: {
      seoHead: {
        title: 'HTML代码格式化工具 - Code Pulse',
        description: '在线HTML代码格式化工具，使用标准规则格式化您的HTML代码，使其更易读和维护',
        keywords: 'HTML格式化,代码格式化,HTML美化,在线工具'
      }
    }
  }, {
    path: '/css',
    name: 'CSS格式化',
    key: 'css-formatter',
    meta: {
      seoHead: {
        title: 'CSS代码格式化工具 - Code Pulse',
        description: '在线CSS代码格式化工具，支持CSS格式化、普通压缩和完全压缩，使用标准规则格式化您的CSS代码，使其更易读和维护',
        keywords: 'CSS格式化,CSS压缩,CSS美化,在线工具'
      }
    }
  }, {
    path: '/sql',
    name: 'SQL格式化',
    key: 'sql-formatter',
    meta: {
      seoHead: {
        title: 'SQL代码格式化工具 - Code Pulse',
        description: '在线SQL代码格式化工具，支持SQL格式化、普通压缩和完全压缩，使用标准规则格式化您的SQL代码，使其更易读和维护',
        keywords: 'SQL格式化,SQL压缩,SQL美化,在线工具'
      }
    }
  }]
}

export default formatterRoutes;
