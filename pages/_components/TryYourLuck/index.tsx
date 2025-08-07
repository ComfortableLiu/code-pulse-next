import { ChangeEvent, memo, useCallback, useState } from "react";
import styles from "./styles.module.scss";
import { Button, Input } from "antd";
import { Base64 } from "js-base64";
import { formatCode } from "@utils/format-utils";

const { TextArea } = Input

const TryYourLuck = () => {

  const [text, setText] = useState("")

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
      const formattedText = await formatCode(text, 'json')
      setText(formattedText)
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
      <TextArea
        value={text}
        autoSize={{
          minRows: 5,
          maxRows: 5,
        }}
        placeholder="请输入待解码内容"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
      />
      <div>
        <Button
          type="primary"
          onClick={handleDecoding}
        >
          尝试解码
        </Button>
      </div>
    </div>
  )
}


export default memo(TryYourLuck)
