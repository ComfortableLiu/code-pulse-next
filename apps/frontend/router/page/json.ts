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
  }, {
    path: '/json2TypeScript',
    key: 'json2TypeScript',
    name: 'JSON转Typescript',
  }]
}

export default jsonRoutes
