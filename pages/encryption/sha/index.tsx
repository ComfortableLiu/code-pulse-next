import { Fragment, memo, useMemo, useState } from "react";
import { Button, Input } from "antd";
import CodeEditor from "@pages/_components/CodeEditor";
import styles from "./styles.module.scss";

const SHA = () => {

  interface ISHAOperationItem {
    name: string
    fun: () => void
  }

  // 原文
  const [originalText, setOriginalText] = useState<string>('')
  // 密文
  const [cipherText, setCipherText] = useState<string>('')
  // 给HMAC加密用的密钥
  const [keyText, setKeyText] = useState<string>('')

  // 普通SHA加密
  const sha = async (originalStr: string, name: '1' | '256' | '512') => {
    // 使用Web Crypto API实现SHA1加密
    const hash = await crypto.subtle
      .digest(`SHA-${name}`, new TextEncoder().encode(originalStr))
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // HMAC-SHA加密
  const hmacSHA = async (originalText: string, name: '1' | '256' | '512', key: string) => {
    const encoder = new TextEncoder();

    // 导入密钥
    const keyStr = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'HMAC', hash: `SHA-${name}` },
      false,
      ['sign']
    );

    // 签名
    const signature = await crypto.subtle.sign(
      'HMAC',
      keyStr,
      encoder.encode(originalText)
    );

    // 转换为十六进制字符串
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

// 普通SHA加密操作集合
  const SHAOperationList: ISHAOperationItem[] = [{
    name: 'SHA 1',
    fun: async (originalStr: string) => sha(originalStr, '1')
  }, {
    name: 'SHA 256',
    fun: async (originalStr: string) => sha(originalStr, '256')
  }, {
    name: 'SHA 512',
    fun: async (originalStr: string) => sha(originalStr, '512')
  }].map(item => ({
    name: item.name,
    fun: async () => setCipherText(await item.fun(originalText))
  }))

// 普通SHA加密操作集合
  const hmacSHAOperationList: ISHAOperationItem[] = [{
    name: 'HMAC-SHA 1',
    fun: async (originalStr: string, key: string) => hmacSHA(originalStr, '1', key)
  }, {
    name: 'HMAC-SHA 256',
    fun: async (originalStr: string, key: string) => hmacSHA(originalStr, '256', key)
  }, {
    name: 'HMAC-SHA 512',
    fun: async (originalStr: string, key: string) => hmacSHA(originalStr, '512', key)
  }].map(item => ({
    name: item.name,
    fun: async () => setCipherText(await item.fun(originalText, keyText))
  }))

  // SHA算法的操作按钮组
  const shaBtnGroupView = useMemo(() => {
    const btnList = SHAOperationList.map(operation => (
      <Button
        key={operation.name}
        type="primary"
        onClick={operation.fun}
      >
        {operation.name}
      </Button>
    ))
    return (
      <div className={styles['btn-group']}>
        {btnList}
      </div>
    )
  }, [SHAOperationList])

  // HMAC-SHA算法的操作按钮组
  const hmacShaBtnGroupView = useMemo(() => {
    const btnList = hmacSHAOperationList.map(operation => (
      <Button
        key={operation.name}
        type="primary"
        disabled={!keyText.length}
        onClick={operation.fun}
      >
        {operation.name}
      </Button>
    ))
    return (
      <div className={styles['btn-group']}>
        {btnList}
      </div>
    )
  }, [hmacSHAOperationList, keyText.length])


  return (
    <Fragment>
      <h1>SHA加密</h1>
      <div className={styles['operation-container']}>
        <CodeEditor
          language="text"
          value={originalText}
          onChange={setOriginalText}
        />
        {shaBtnGroupView}
        <Input
          value={keyText}
          onChange={(e) => setKeyText(e.target.value)}
          addonBefore="HMAC-SHA密钥"
        />
        {hmacShaBtnGroupView}
        <CodeEditor
          language="text"
          value={cipherText}
          onChange={setCipherText}
        />
      </div>
    </Fragment>
  )
}

export default memo(SHA)
