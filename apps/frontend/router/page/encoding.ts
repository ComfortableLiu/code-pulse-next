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
  }, {
    path: '/url',
    name: 'URL编码',
    key: 'url',
  }]
}

export default encryption
