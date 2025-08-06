import { memo, useState, useCallback, Fragment } from "react";
import styles from "./styles.module.scss";
import { Button, message } from "antd";

const RandomString = () => {
  const [count, setCount] = useState<number>(1);
  const [type, setType] = useState<string>("uuid");
  const [length, setLength] = useState<number>(16);
  const [customChars, setCustomChars] = useState<string>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
  const [results, setResults] = useState<string[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  // 生成UUID v4
  const generateUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // 生成随机字符串
  const generateRandomString = (len: number, chars: string): string => {
    let result = "";
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 生成GUID (与UUID相同格式)
  const generateGUID = useCallback((): string => {
    return generateUUID();
  }, [])

  const handleGenerate = useCallback(() => {
    const newResults: string[] = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case "uuid":
          newResults.push(generateUUID());
          break;
        case "guid":
          newResults.push(generateGUID());
          break;
        case "random":
          newResults.push(generateRandomString(length, customChars));
          break;
        default:
          newResults.push(generateRandomString(length, customChars));
      }
    }
    setResults(newResults);
  }, [count, type, generateGUID, length, customChars]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => messageApi.success("复制成功").then())
  }, [messageApi]);

  const handleCopyAll = useCallback(() => {
    navigator.clipboard
      .writeText(results.join("\n"))
      .then(() => messageApi.success("复制成功").then())
  }, [messageApi, results]);

  return (
    <Fragment>
      {contextHolder}
      <div className="main-feature-area">
        <div className="base-component">
          <div className="title">
            <h2 className="title-text">随机字符串</h2>
          </div>
          <div className="content-area">
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <label>生成类型:</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="type"
                      value="uuid"
                      checked={type === "uuid"}
                      onChange={() => setType("uuid")}
                    />
                    UUID
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="type"
                      value="guid"
                      checked={type === "guid"}
                      onChange={() => setType("guid")}
                    />
                    GUID
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="type"
                      value="random"
                      checked={type === "random"}
                      onChange={() => setType("random")}
                    />
                    随机字符串
                  </label>
                </div>
              </div>

              <div className={styles.controlGroup}>
                <label htmlFor="count">生成数量:</label>
                <input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className={styles.input}
                />
              </div>

              {type === "random" && (
                <>
                  <div className={styles.controlGroup}>
                    <label htmlFor="length">字符串长度:</label>
                    <input
                      id="length"
                      type="number"
                      min="1"
                      max="1000"
                      value={length}
                      onChange={(e) => setLength(Math.max(1, Math.min(1000, parseInt(e.target.value) || 16)))}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.controlGroup}>
                    <label htmlFor="customChars">字符集:</label>
                    <textarea
                      id="customChars"
                      value={customChars}
                      onChange={(e) => setCustomChars(e.target.value)}
                      className={styles.textarea}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="btn">
                <Button type="primary" onClick={handleGenerate}>生成</Button>
              </div>
            </div>

            {results.length > 0 && (
              <div className={styles.results}>
                <div className={styles.resultsHeader}>
                  <h3>生成结果:</h3>
                  <Button
                    type="primary"
                    onClick={handleCopyAll}
                  >
                    复制全部
                  </Button>
                </div>
                <ul className={styles.resultList}>
                  {results.map((result, index) => (
                    <li key={index} className={styles.resultItem}>
                      <span className={styles.resultText}>{result}</span>
                      <Button
                        variant="solid"
                        color="green"
                        onClick={() => handleCopy(result)}
                      >
                        复制
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(RandomString);
