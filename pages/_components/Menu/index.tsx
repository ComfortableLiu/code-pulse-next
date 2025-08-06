import { memo, useMemo } from "react";
import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { allRoutes, allRoutesMap } from "@router/index";
import { IRouteItem } from "@router/type";
import { classnames } from "@utils/classnames";
import styles from "./styles.module.scss"

const Menu = () => {

  const route = useRouter()

// 现在选择的一级菜单
  const selectedFirstMenu = useMemo(() => allRoutesMap.get(`/${route.pathname.split('/')[1]}`), [route.pathname])
// 现在选择的二级菜单
  const selectedSecondMenu = useMemo(() => allRoutesMap.get(route.pathname), [route.pathname])

  // 一级菜单
  const firstMenuView = useMemo(() => {
    // 一级列表
    const list = allRoutes.map((route) => {
      const items: MenuProps['items'] = (route.children || []).map((children: IRouteItem) => {
        const href = `${route.path || ''}${children.path}`
        return {
          key: children.key,
          label: (
            <Link
              href={href}
              className={classnames(styles['link-a'], {
                [styles.active]: selectedFirstMenu?.key === route.key
              })}
            >
              {children.name}
            </Link>
          ),
        }
      })

      const href = route.children ? `${route.path}${route.children[0].path}` : route.path
      return (
        <Dropdown
          key={route.key}
          menu={{ items }}
        >
          <Link
            href={href}
            className={classnames(styles['link-a'], {
              [styles.active]: selectedFirstMenu?.key === route.key
            })}
          >
            {route.name}
          </Link>
        </Dropdown>
      )
    })

    // 容器
    return (
      <div className={styles.content}>
        {list}
      </div>
    )
  }, [selectedFirstMenu?.key])

  // 二级菜单
  const secondMenuView = useMemo(() => {
    const list = (selectedFirstMenu?.children || []).map(route => {
      const href = `${selectedFirstMenu?.path || ''}${route.path}`
      return (
        <Link
          href={href}
          key={route.key}
          className={classnames(styles['link-a'], {
            [styles.active]: selectedSecondMenu?.key === route.key
          })}
        >
          {route.name}
        </Link>
      )
    })

    return (
      <div className={styles.content}>
        {list}
      </div>
    )
  }, [selectedFirstMenu?.children, selectedFirstMenu?.path, selectedSecondMenu?.key])

  return (
    <div className={styles.menu}>
      <div className={styles['menu-first']}>
        {firstMenuView}
      </div>
      {selectedFirstMenu?.children ?
        <div className={styles['menu-second']}>
          {secondMenuView}
        </div>
        : null}
    </div>
  )
}

export default memo(Menu)
