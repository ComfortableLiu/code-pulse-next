import { IRouteItem } from "../type";

const encryption: IRouteItem = {
  path: '/encoding',
  name: '编码',
  key: 'encoding',
  notComponent: true,
  children: [{
    path: '/base64',
    name: 'Base64编码',
    key: 'base64',
    meta: {
      seoHead: {
        title: 'Base64编码/解码工具 - Code Pulse',
        description: '在线Base64编码和解码工具，支持文本、URL等数据的Base64编码转换，开发者必备工具',
        keywords: 'Base64编码,Base64解码,在线编码工具,数据编码,Base64转换'
      }
    }
  }, {
    path: '/url',
    name: 'URL编码',
    key: 'url',
    meta: {
      seoHead: {
        title: 'URL编码/解码工具 - Code Pulse',
        description: '在线URL编码和解码工具，帮助开发者处理URL中的特殊字符编码问题',
        keywords: 'URL编码,URL解码,URL转义,encodeURIComponent,decodeURIComponent'
      }
    }
  }]
}

export default encryption
