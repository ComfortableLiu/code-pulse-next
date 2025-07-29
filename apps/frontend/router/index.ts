import encryptionRoutes from "./page/encryption";
import jsonRoutes from "./page/json";
import encodingRoutes from "./page/encoding";
import aboutRoutes from "./page/about";
import qrcodeRoutes from "./page/qr-code";
import type { IRouteItem } from "./type";

const homepageRoutes: IRouteItem = {
  path: '/',
  name: '首页',
  key: 'homepage',
}

export const allRoutes = [
  homepageRoutes,
  jsonRoutes,
  encryptionRoutes,
  encodingRoutes,
  qrcodeRoutes,
  aboutRoutes,
]

// 用来做path=>item的映射的，同时包括一级和二级菜单
export const allRoutesMap: Map<string, IRouteItem> = allRoutes.reduce((previousValue, currentValue) => {
  previousValue.set(currentValue.path, currentValue)
  if (currentValue.children) {
    currentValue.children.forEach((route) => {
      if (!route.hasComponent) return
      previousValue.set(`${currentValue.path || ''}${route.path}`, route)
    })
  }
  return previousValue
}, new Map<string, IRouteItem>())

// 功能同上，但是只包括带页面的路由
export const flatRoutes = allRoutes.reduce((previousValue, currentValue) => {
  if (currentValue.hasComponent) {
    previousValue.set(currentValue.path, currentValue)
  }
  if (currentValue.children) {
    currentValue.children.forEach((route: IRouteItem) => {
      if (!route.hasComponent) return
      previousValue.set(`${currentValue.path || ''}${route.path}`, route)
    })
  }
  return previousValue
}, new Map<string, IRouteItem>())
