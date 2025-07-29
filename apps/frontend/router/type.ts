export interface IRouteItem {
  path: `/${string}`,
  alias?: `/${string}`[]
  key: string,
  name: string,
  children?: IRouteItem[]
  hasComponent?: boolean
}
