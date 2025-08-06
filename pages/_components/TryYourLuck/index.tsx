import { memo, useCallback, useRef, useState } from "react";
import styles from "./styles.module.scss";
import CodeEditor, { ICodeEditorRef } from "@pages/_components/CodeEditor";
import { Button } from "antd";
import { Base64 } from "js-base64";

const TryYourLuck = () => {

  const [text, setText] = useState("")
  const [language, setLanguage] = useState<"json" | "text">("json")
  // 持有json组件的ref，为了调用其格式化代码
  const jsonEditorRef = useRef<ICodeEditorRef>(null)

  function isJSON(str: string) {
    try {
      const obj = JSON.parse(str);
      // 检查解析后的结果是否为对象或数组，并且不是null
      return typeof obj === 'object' && obj !== null;
    } catch (e) {
      return false;
    }
  }

  function isBase64(str: string) {
    try {
      return Base64.isValid(str);
    } catch (e) {
      return false;
    }
  }

  function isUrlEncode(str: string) {
    try {
      return decodeURIComponent(str) !== str;
    } catch (e) {
      return false;
    }
  }

  const handleDecoding = useCallback(async () => {
    if (isJSON(text)) {
      setLanguage('json')
      setTimeout(() => jsonEditorRef.current?.doFormatCode?.())
    } else if (isBase64(text)) {
      setText(Base64.decode(text))
    } else if (isUrlEncode(text)) {
      setText(decodeURIComponent(text))
    }
  }, [text])

  return (
    <div className={styles.container}>
      <div className={styles.title}>万能解码器</div>
      <div className={styles.hint}>支持：Base64解码、URL解码、json格式化</div>
      <CodeEditor
        ref={jsonEditorRef}
        language={language}
        value={text}
        onChange={setText}
        showFormat={false}
      >
        <Button
          type="primary"
          onClick={handleDecoding}
        >
          尝试解码
        </Button>
      </CodeEditor>
    </div>
  )
}


export default memo(TryYourLuck)
