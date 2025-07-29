import { IRouteItem } from "../type";

const encryption: IRouteItem = {
  path: '/encoding',
  name: '编码',
  key: 'encoding',
  children: [{
    path: '/base64',
    name: 'Base64编码',
    hasComponent: true,
    key: 'base64',
  }, {
    path: '/url',
    name: 'URL编码',
    hasComponent: true,
    key: 'url',
  }]
}

export default encryption
