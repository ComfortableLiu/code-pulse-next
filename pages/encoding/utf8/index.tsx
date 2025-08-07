import { Button } from "antd";
import { ArrowLeft, ArrowRight } from "@icon-park/react";
import { Fragment, memo, useState } from "react";
import styles from "./styles.module.scss";

const UTF8Encoding = () => {
  // 待编码的文本
  const [textToEncode, setTextToEncode] = useState<string>('')
  // 待解码的文本
  const [textToDecode, setTextToDecode] = useState<string>('')

  // UTF-8编码函数
  const encodeToUTF8 = () => {
    try {
      // 将文本转换为UTF-8字节数组
      const encoder = new TextEncoder();
      const bytes = encoder.encode(textToEncode);

      // 将字节转换为十六进制表示
      const hexBytes = Array.from(bytes).map(byte =>
        '0x' + byte.toString(16).padStart(2, '0').toUpperCase()
      ).join(' ');

      setTextToDecode(hexBytes);
    } catch (e) {
      setTextToDecode('编码错误: ' + (e as Error).message);
    }
  }

  // UTF-8解码函数
  const decodeFromUTF8 = () => {
    try {
      // 解析十六进制字节字符串
      const hexMatches = textToDecode.match(/0x([0-9A-Fa-f]{2})/g);

      if (!hexMatches) {
        setTextToEncode('解码错误: 未找到有效的十六进制字节');
        return;
      }

      // 将十六进制转换为字节数组
      const bytes = new Uint8Array(hexMatches.map(hex =>
        parseInt(hex.replace('0x', ''), 16)
      ));

      // 使用TextDecoder将字节解码为文本
      const decoder = new TextDecoder('utf-8');
      const decoded = decoder.decode(bytes);

      setTextToEncode(decoded);
    } catch (e) {
      setTextToEncode('解码错误: ' + (e as Error).message);
    }
  }

  return (
    <Fragment>
      <h1>UTF-8编码</h1>
      <div className={styles['operation-container']}>
        <textarea
          className={styles.textarea}
          value={textToEncode}
          onChange={(e) => setTextToEncode(e.target.value)}
          placeholder="输入要编码的文本..."
        />
        <div className={styles['btn-group']}>
          <Button onClick={encodeToUTF8}>
            <ArrowRight theme="two-tone" size={24} fill={['#000', '#fff']} />
          </Button>
          <Button onClick={decodeFromUTF8}>
            <ArrowLeft theme="two-tone" size={24} fill={['#000', '#fff']} />
          </Button>
        </div>
        <textarea
          className={styles.textarea}
          value={textToDecode}
          onChange={(e) => setTextToDecode(e.target.value)}
          placeholder="输入要解码的UTF-8字节 (例如: 0xE4 0xBD 0xA0 0xE5 0xA5 0xBD)..."
        />
      </div>
      <div className={styles['info-section']}>
        <h3>关于UTF-8编码</h3>
        <p>UTF-8是一种可变长度的字符编码，能够编码所有Unicode字符。它被广泛用于互联网和现代软件中，是Web的默认编码。</p>
        <p>UTF-8使用1到4个字节来编码每个字符：</p>
        <ul>
          <li>ASCII字符 (U+0000 到 U+007F) 使用1个字节</li>
          <li>其他字符使用2到4个字节</li>
        </ul>
        <p><strong>使用说明：</strong>在左侧输入文本，点击右箭头按钮进行编码；在右侧输入以&#34;0x&#34;开头的十六进制字节序列，点击左箭头按钮进行解码。</p>
      </div>
    </Fragment>
  )
}

export default memo(UTF8Encoding)
