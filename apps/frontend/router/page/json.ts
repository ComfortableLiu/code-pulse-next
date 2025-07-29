import { IRouteItem } from "../type";

const jsonRoutes: IRouteItem = {
  name: 'JSON',
  key: 'json',
  path: '/json',
  children: [{
    path: '/format',
    key: 'format',
    name: 'JSON格式化',
    hasComponent: true,
  }, {
    path: '/json2TypeScript',
    key: 'json2TypeScript',
    name: 'JSON转Typescript',
    hasComponent: true,
  }]
}

export default jsonRoutes
