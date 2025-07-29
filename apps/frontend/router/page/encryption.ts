import { IRouteItem } from "../type";

const encryption: IRouteItem = {
  path: '/encryption',
  name: '加解密',
  key: 'encryption',
  children: [{
    path: '/sha',
    name: 'SHA加密',
    key: 'sha',
    hasComponent: true,
  }]
}

export default encryption
