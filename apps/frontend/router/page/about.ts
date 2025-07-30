import { IRouteItem } from "../type";

const about: IRouteItem = {
  path: '/about',
  name: '关于我们',
  key: 'about',
  alias: ['/about/us', '/about-us', '/aboutUs'],
  meta: {
    seoHead: {
      title: '关于我们 - Code Pulse',
      description: 'Code Pulse 致力于为广大开发者提供一系列实用的小工具，帮助大家提升开发效率、简化日常工作流程。',
      keywords: '工具,提效,研发,开发者工具,在线工具'
    }
  }
}

export default about
