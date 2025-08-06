import { memo, useState, useCallback } from "react";
import styles from "./styles.module.scss";

const RandomNumber = () => {
  const [min, setMin] = useState<string>("0");
  const [max, setMax] = useState<string>("100");
  const [decimalPlaces, setDecimalPlaces] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  const [numberType, setNumberType] = useState<"integer" | "decimal" | "bigint">("integer");

  const generateRandomNumber = useCallback(() => {
    try {
      if (numberType === "bigint") {
        // 处理大整数
        const minBigInt = BigInt(min);
        const maxBigInt = BigInt(max);

        if (minBigInt > maxBigInt) {
          setResult("错误：最小值不能大于最大值");
          return;
        }

        const range = maxBigInt - minBigInt;
        const randomInRange = BigInt(Math.floor(Math.random() * Number(range) + 1));
        setResult((minBigInt + randomInRange).toString());
      } else if (numberType === "decimal") {
        // 处理小数
        const minNum = parseFloat(min);
        const maxNum = parseFloat(max);

        if (isNaN(minNum) || isNaN(maxNum)) {
          setResult("错误：请输入有效的数字");
          return;
        }

        if (minNum >= maxNum) {
          setResult("错误：最小值必须小于最大值");
          return;
        }

        const random = Math.random() * (maxNum - minNum) + minNum;
        setResult(random.toFixed(decimalPlaces));
      } else {
        // 处理普通整数
        const minInt = parseInt(min, 10);
        const maxInt = parseInt(max, 10);

        if (isNaN(minInt) || isNaN(maxInt)) {
          setResult("错误：请输入有效的整数");
          return;
        }

        if (minInt >= maxInt) {
          setResult("错误：最小值必须小于最大值");
          return;
        }

        const randomInt = Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
        setResult(randomInt.toString());
      }
    } catch (error) {
      setResult("生成出错: " + (error instanceof Error ? error.message : String(error)));
    }
  }, [min, max, decimalPlaces, numberType]);

  const isErrorResult = result.startsWith("错误") || result.startsWith("生成出错");

  return (
    <div className={styles["main-feature-area"]}>
      <div className={styles["base-component"]}>
        <div className={styles.title}>
          <h2 className={styles["title-text"]}>随机数</h2>
        </div>
        <div className={styles["content-area"]}>
          <div className={styles["option-group"]}>
            <label>
              <input
                type="radio"
                checked={numberType === "integer"}
                onChange={() => setNumberType("integer")}
              />
              整数
            </label>
            <label>
              <input
                type="radio"
                checked={numberType === "decimal"}
                onChange={() => setNumberType("decimal")}
              />
              小数
            </label>
            <label>
              <input
                type="radio"
                checked={numberType === "bigint"}
                onChange={() => setNumberType("bigint")}
              />
              超大整数
            </label>
          </div>

          <div className={styles["input-group"]}>
            <label>最小值:</label>
            <input
              type="text"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>

          <div className={styles["input-group"]}>
            <label>最大值:</label>
            <input
              type="text"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>

          {numberType === "decimal" && (
            <div className={styles["input-group"]}>
              <label>小数位数:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          <div className={styles.btn}>
            <button onClick={generateRandomNumber}>生成</button>
          </div>

          {result && (
            <div className={`${styles.result} ${isErrorResult ? styles.error : ''}`}>
              <strong>生成结果:</strong> {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(RandomNumber);
