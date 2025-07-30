import type { Metadata } from "next";

export interface IRouteItem {
  path: `/${string}`,
  alias?: `/${string}`[]
  key: string,
  name: string,
  children?: IRouteItem[]
  notComponent?: boolean
  meta?: {
    isHidden?: boolean;
    // 为了SEO，只好委屈你了，所有页面必须要写一个描述
    seoHead: Metadata
  }
}
