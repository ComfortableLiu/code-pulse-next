import { IRouteItem } from "../type";

const qrcode: IRouteItem = {
  path: '/qrcode',
  name: '二维码生成',
  key: 'qrcode',
  meta: {
    seoHead: {
      title: '二维码生成器 - Code Pulse',
      description: '在线二维码生成工具，支持自定义颜色、logo、容错等级等高级设置，免费生成高质量二维码',
      keywords: '二维码生成,QR码制作,在线生成二维码,二维码工具,自定义二维码'
    }
  }
}

export default qrcode
