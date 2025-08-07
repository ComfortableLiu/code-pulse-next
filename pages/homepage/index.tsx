import { Fragment, memo, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "antd";
import Link from "next/link";
import { IRouteItem } from "@router/type";
import {
  FREQUENT_ROUTES_KEY,
  getFrequentRouteHistory,
  getRecentRouteHistory,
  IRouteFrequencyRecordList,
  RECENT_VISITS_KEY
} from "@utils/router";
import TryYourLuck from "@pages/_components/TryYourLuck";
import apiClient from "@utils/request";

const Homepage = () => {

  // 高频路由数量
  const FREQUENT_ROUTE_HISTORY_NUM = 10;
  // 最近访问路由数量
  const RECENT_ROUTE_HISTORY_NUM = 10;

  // 最近访问路由列表
  const [recentRouteHistoryList, setRecentRouteHistoryList] = useState<IRouteItem[]>()
  // 高频访问路由列表
  const [frequentRouteHistoryList, setFrequentRouteHistoryList] = useState<IRouteFrequencyRecordList>()

  // Localstorage变化监听函数
  const handleStorageChange = (e?: StorageEvent) => {
    if (e && ![RECENT_VISITS_KEY, FREQUENT_ROUTES_KEY].includes(e.key || '')) return
    setRecentRouteHistoryList(getRecentRouteHistory(RECENT_ROUTE_HISTORY_NUM))
    setFrequentRouteHistoryList(getFrequentRouteHistory(FREQUENT_ROUTE_HISTORY_NUM))
  }

  useEffect(() => {
    if (window) {
      window.addEventListener("storage", handleStorageChange)
    }
    handleStorageChange()
    return () => {
      if (window) {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [])

  useEffect(() => {
    apiClient.get('/api/test').then(res => {
      console.log(res.data)
    }).catch(err => {
      console.error(err)
    })
  }, []);

  // 最近使用模块
  const recentRouteHistoryListView = useMemo(() => {
    if (!recentRouteHistoryList?.length) return null
    const linkList = (recentRouteHistoryList)?.map(item => (
      <Link
        href={item.path}
        key={item.key}
      >
        <Button
          className={styles.btn}
          type="default"
        >
          {item.name}
        </Button>
      </Link>
    ))
    return (
      <div className={styles['base-component']}>
        <h2 className={styles.title}>最近使用</h2>
        <div className={styles['content-area']}>
          {linkList}
        </div>
      </div>
    )
  }, [recentRouteHistoryList])

  // 最常用模块
  const frequentRouteHistoryListView = useMemo(() => {
    if (!frequentRouteHistoryList?.length) return null
    const linkList = frequentRouteHistoryList.map(item => (
      <Link
        href={item.route.path}
        key={item.route.name}
      >
        <Button
          className={styles.btn}
          type="primary"
        >
          {item.route.name}
        </Button>
      </Link>
    ))
    return (
      <div className={styles['base-component']}>
        <h2 className={styles.title}>最常用</h2>
        <div className={styles['content-area']}>
          {linkList}
        </div>
      </div>
    )
  }, [frequentRouteHistoryList])

  return (
    <Fragment>
      <TryYourLuck />
      {recentRouteHistoryList?.length || frequentRouteHistoryList?.length ?
        <div className={styles['main-feature-area']}>
          {recentRouteHistoryListView}
          {frequentRouteHistoryListView}
        </div>
        : null}
    </Fragment>
  )
}

export default memo(Homepage);
