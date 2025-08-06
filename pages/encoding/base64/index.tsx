import { Button } from "antd";
import { ArrowLeft, ArrowRight } from "@icon-park/react";
import { Fragment, memo, useState } from "react";
import styles from "./styles.module.scss";
import { Base64 } from "js-base64";
import CodeEditor from "@pages/_components/CodeEditor";

const Base64Encoding = () => {

  // 解码后的文本
  const [decodingText, setDecodingText] = useState<string>('')
  // 编码后的文本
  const [encodingText, setEncodingText] = useState<string>('')

  const encodingBase64 = () => {
    setDecodingText(Base64.encode(encodingText))
  }

  const decodingBase64 = () => {
    setEncodingText(Base64.decode(decodingText))
  }
  return (
    <Fragment>
      <h1>Base64编码</h1>
      <div className={styles['operation-container']}>
        <CodeEditor
          language="text"
          value={encodingText}
          onChange={setEncodingText}
        />
        <div className={styles['btn-group']}>
          <Button onClick={encodingBase64}>
            <ArrowRight theme="two-tone" size={24} fill={['#000', '#fff']} />
          </Button>
          <Button onClick={decodingBase64}>
            <ArrowLeft theme="two-tone" size={24} fill={['#000', '#fff']} />
          </Button>
        </div>
        <CodeEditor
          language="text"
          value={decodingText}
          onChange={setDecodingText}
        />
      </div>
    </Fragment>
  )
}

export default memo(Base64Encoding)
