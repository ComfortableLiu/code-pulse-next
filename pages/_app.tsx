import React, { memo, useEffect, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import theme from '../app/theme/themeConfig';
import styles from "./_app.module.scss"
import MenuView from "./_components/Menu";
import "../app/main.css"
import Footer from "./_components/Footer";
import { useRouter } from "next/router";
import { handleHead, maintainFrequentRouteHistory, manageRouteHistory } from "@utils/router";
import { allRoutesMap } from "@router/index";
import type { Metadata } from "next";

const App = ({ Component, pageProps }: AppProps) => {

  const router = useRouter()

  const handleRouter = (path: string) => {
    // 维护最近历史记录
    manageRouteHistory(path as `/${string}`)
    // 维护高频路由历史记录
    maintainFrequentRouteHistory(path as `/${string}`)
  }

  useEffect(() => {
    handleRouter(router.pathname)
  }, [router.pathname])

  const metadata = useMemo(() => handleHead(allRoutesMap.get(router.pathname)), [router.pathname])

  return (
    <ConfigProvider theme={theme}>
      <title>{metadata.title as string || ''}</title>
      <meta name="description" content={metadata.description || ''} />
      <meta name="keywords" content={metadata.keywords as string || ''} />
      <div className={styles['app-main-style']}>
        <header className={styles['app-main-header']}>
          <MenuView />
        </header>
        <main className={styles['app-router-view']}>
          <Component  {...pageProps} />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </ConfigProvider>
  )
}

export default memo(App);
