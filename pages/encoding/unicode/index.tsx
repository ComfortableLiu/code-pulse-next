import { Button } from "antd";
import { ArrowLeft, ArrowRight } from "@icon-park/react";
import { Fragment, memo, useState } from "react";
import styles from "./styles.module.scss";

const UnicodeEncoding = () => {
  // 待编码的文本
  const [textToEncode, setTextToEncode] = useState<string>('')
  // 待解码的文本
  const [textToDecode, setTextToDecode] = useState<string>('')

  // Unicode编码函数
  const encodeToUnicode = () => {
    try {
      const encoded = textToEncode.replace(/./g, (char) => {
        const code = char.charCodeAt(0).toString(16).toUpperCase();
        return "\\u" + "0000".substring(0, 4 - code.length) + code;
      });
      setTextToDecode(encoded);
    } catch (e) {
      setTextToDecode('编码错误: ' + (e as Error).message);
    }
  }

  // Unicode解码函数
  const decodeFromUnicode = () => {
    try {
      const decoded = textToDecode.replace(/\\u([0-9a-fA-F]{4})/g, (_, group) => {
        return String.fromCharCode(parseInt(group, 16));
      });
      setTextToEncode(decoded);
    } catch (e) {
      setTextToEncode('解码错误: ' + (e as Error).message);
    }
  }

  return (
    <Fragment>
      <h1>Unicode编码</h1>
      <div className={styles['operation-container']}>
        <textarea
          className={styles.textarea}
          value={textToEncode}
          onChange={(e) => setTextToEncode(e.target.value)}
          placeholder="输入要编码的文本..."
        />
        <div className={styles['btn-group']}>
          <Button onClick={encodeToUnicode}>
            <ArrowRight theme="two-tone" size={24} fill={['#000', '#fff']} />
          </Button>
          <Button onClick={decodeFromUnicode}>
            <ArrowLeft theme="two-tone" size={24} fill={['#000', '#fff']} />
          </Button>
        </div>
        <textarea
          className={styles.textarea}
          value={textToDecode}
          onChange={(e) => setTextToDecode(e.target.value)}
          placeholder="输入要解码的Unicode (例如: \u4F60\u597D)..."
        />
      </div>
      <div className={styles['info-section']}>
        <h3>关于Unicode编码</h3>
        <p>Unicode是一种国际编码标准，为世界上几乎所有的字符提供唯一的数字标识。它使得文本在不同的平台和程序之间能够一致地表示和传输。</p>
        <p>Unicode编码使用16进制数字表示字符，通常以\u开头，后跟4位十六进制数字。</p>
        <p>
          <strong>使用说明：</strong>在左侧输入文本，点击右箭头按钮进行编码；在右侧输入以&#34;\u&#34;开头的Unicode编码序列，点击左箭头按钮进行解码。
        </p>
      </div>
    </Fragment>
  )
}

export default memo(UnicodeEncoding)
