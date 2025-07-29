import { Fragment, memo, useState } from "react";
import { Button } from "antd";
import { ArrowLeft, ArrowRight } from "@icon-park/react";
import styles from "./styles.module.scss";
import CodeEditor from "@pages/_components/CodeEditor";

const Url = () => {

// 解码后的文本
  const [decodingText, setDecodingText] = useState<string>('')
// 编码后的文本
  const [encodingText, setEncodingText] = useState<string>('')

  const encodeURL = () => {
    setDecodingText(encodeURIComponent(encodingText))
  }

  const decodeURL = () => {
    setEncodingText(decodeURIComponent(decodingText))
  }

  return (
    <Fragment>
      <h1>URL编码</h1>
      <div className={styles['operation-container']}>
        <CodeEditor
          language="text"
          value={encodingText}
          onChange={setEncodingText}
        />
        <div className={styles['btn-group']}>
          <Button onClick={encodeURL}>
            <ArrowRight theme="two-tone" size={24} fill={['#000', '#fff']} />
          </Button>
          <Button onClick={decodeURL}>
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


export default memo(Url)
