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
  alias: ['/home', '/homepage', '/index'],
  meta: {
    seoHead: {
      title: 'Code Pulse - 开发者工具平台',
      description: 'Code Pulse 为开发者提供一系列实用的小工具，包括JSON格式化、Base64编码、SHA加密、二维码生成等，帮助提升开发效率',
      keywords: '开发者工具,在线工具,JSON格式化,Base64编码,SHA加密,二维码生成'
    }
  }
}

export const allRoutes = [
  homepageRoutes,
  jsonRoutes,
  encryptionRoutes,
  encodingRoutes,
  qrcodeRoutes,
  aboutRoutes,
]

// 用来做path=>item的映射的，同时包括一级和二级菜单，并同时包括别名
export const allRoutesWithAliasMap: Map<string, IRouteItem> = allRoutes.reduce((previousValue, currentValue) => {
  previousValue.set(currentValue.path, currentValue);
  (currentValue.alias || []).forEach(alias => previousValue.set(alias, currentValue))
  if (currentValue.children) {
    currentValue.children.forEach((route) => {
      previousValue.set(`${currentValue.path || ''}${route.path}`, route);
      (route.alias || []).forEach(alias => previousValue.set(`${currentValue.path || ''}${alias}`, currentValue))
    })
  }
  return previousValue
}, new Map<string, IRouteItem>())

// 用来做path=>item的映射的，同时包括一级和二级菜单
export const allRoutesMap: Map<string, IRouteItem> = allRoutes.reduce((previousValue, currentValue) => {
  previousValue.set(currentValue.path, currentValue)
  if (currentValue.children) {
    currentValue.children.forEach((route) => {
      previousValue.set(`${currentValue.path || ''}${route.path}`, route)
    })
  }
  return previousValue
}, new Map<string, IRouteItem>())

// 功能同上，但是只包括带页面的路由
export const flatRoutes = allRoutes.reduce((previousValue, currentValue) => {
  if (!currentValue.notComponent) {
    previousValue.set(currentValue.path, currentValue)
  }
  if (currentValue.children) {
    currentValue.children.forEach((route: IRouteItem) => {
      if (route.notComponent) return
      previousValue.set(`${currentValue.path || ''}${route.path}`, route)
    })
  }
  return previousValue
}, new Map<string, IRouteItem>())
