import { IRouteItem } from "../type";

const random: IRouteItem = {
  path: '/random',
  name: '随机生成器',
  key: 'random',
  notComponent: true,
  children: [{
    path: '/number',
    name: '随机数生成',
    key: 'number',
    meta: {
      seoHead: {
        title: '随机数生成器 - Code Pulse',
        description: '在线随机数生成，支持整数、小数',
        keywords: '随机数,随机数生成,整数,小数,随机整数,随机小数'
      }
    }
  }, {
    path: '/string',
    name: '随机字符串生成',
    key: 'string',
    meta: {
      seoHead: {
        title: '随机字符串生成器 - Code Pulse',
        description: '在线随机字符串生成，同时支持生成uuid等模板',
        keywords: '随机字符串,随机字符串生成,uuid'
      }
    }
  }]
}

export default random
