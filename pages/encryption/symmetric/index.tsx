import { Fragment, memo, useCallback, useMemo, useState } from "react";
import { Button, Card, Col, Input, message, Radio, Row } from "antd";
import styles from "./styles.module.scss";

const { TextArea } = Input;
const { Group: RadioGroup } = Radio;

const SymmetricEncryption = () => {
  // 原文
  const [originalText, setOriginalText] = useState<string>('');
  // 密文
  const [cipherText, setCipherText] = useState<string>('');
  // 密钥
  const [secretKey, setSecretKey] = useState<string>('mySecretKey');
  // 选择的算法
  const [algorithm, setAlgorithm] = useState<string>('AES');
  // 操作模式 (加密/解密)
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // 支持的算法列表
  const algorithms = useMemo(() => [
    { label: 'AES', value: 'AES' },
    { label: 'DES', value: 'DES' },
    { label: 'RC4', value: 'RC4' },
    { label: 'Rabbit', value: 'Rabbit' },
    { label: 'TripleDes', value: 'TripleDes' }
  ], [])

  // 获取加密算法处理对象
  const getCryptoHandler = async () => {
    // 动态导入 crypto-js 模块
    return await import('crypto-js');
  };

  // 加密函数
  const encrypt = useCallback(async (text: string, alg: string, key: string) => {
    try {
      const CryptoJS = await getCryptoHandler();

      switch (alg) {
        case 'AES':
          return CryptoJS.AES.encrypt(text, key).toString();
        case 'DES':
          return CryptoJS.DES.encrypt(text, key).toString();
        case 'RC4':
          return CryptoJS.RC4.encrypt(text, key).toString();
        case 'Rabbit':
          return CryptoJS.Rabbit.encrypt(text, key).toString();
        case 'TripleDes':
          return CryptoJS.TripleDES.encrypt(text, key).toString();
        default:
          return '';
      }
    } catch (error) {
      message.error(`加密失败: ${error}`);
      return '';
    }
  }, [])

  // 解密函数
  const decrypt = useCallback(async (cipher: string, alg: string, key: string) => {
    try {
      const CryptoJS = await getCryptoHandler();

      switch (alg) {
        case 'AES':
          const aesDecrypted = CryptoJS.AES.decrypt(cipher, key);
          return aesDecrypted.toString(CryptoJS.enc.Utf8);
        case 'DES':
          const desDecrypted = CryptoJS.DES.decrypt(cipher, key);
          return desDecrypted.toString(CryptoJS.enc.Utf8);
        case 'RC4':
          const rc4Decrypted = CryptoJS.RC4.decrypt(cipher, key);
          return rc4Decrypted.toString(CryptoJS.enc.Utf8);
        case 'Rabbit':
          const rabbitDecrypted = CryptoJS.Rabbit.decrypt(cipher, key);
          return rabbitDecrypted.toString(CryptoJS.enc.Utf8);
        case 'TripleDes':
          const tripleDesDecrypted = CryptoJS.TripleDES.decrypt(cipher, key);
          return tripleDesDecrypted.toString(CryptoJS.enc.Utf8);
        default:
          return '';
      }
    } catch (error) {
      message.error(`解密失败: ${error}`);
      return '';
    }
  }, [])

  // 执行加密或解密操作
  const handleOperation = useCallback(async () => {
    if (!originalText) {
      message.warning('请输入原文');
      return;
    }

    if (mode === 'encrypt') {
      const result = await encrypt(originalText, algorithm, secretKey);
      setCipherText(result);
    } else {
      try {
        const result = await decrypt(originalText, algorithm, secretKey);
        setCipherText(result);
      } catch (error) {
        message.error('解密失败，请检查密文和密钥是否正确');
      }
    }
  }, [algorithm, decrypt, encrypt, mode, originalText, secretKey])

  // 交换原文和密文
  const swapTexts = useCallback(() => {
    const temp = originalText;
    setOriginalText(cipherText);
    setCipherText(temp);
  }, [cipherText, originalText])

  // 算法选择组件
  const algorithmSelector = useMemo(() => (
    <RadioGroup
      options={algorithms}
      onChange={(e) => setAlgorithm(e.target.value)}
      value={algorithm}
      optionType="button"
      buttonStyle="solid"
    />
  ), [algorithm, algorithms]);

  // 操作按钮组
  const operationButtons = useMemo(() => (
    <div className={styles['btn-group']}>
      <Button
        type="primary"
        onClick={handleOperation}
      >
        {mode === 'encrypt' ? '加密' : '解密'}
      </Button>
      <Button
        onClick={swapTexts}
      >
        交换文本
      </Button>
      <Button
        onClick={() => setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')}
      >
        切换到{mode === 'encrypt' ? '解密' : '加密'}
      </Button>
    </div>
  ), [handleOperation, mode, swapTexts]);

  return (
    <Fragment>
      <h1>对称加密</h1>
      <div className={styles['operation-container']}>
        <Card title="加密设置" style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <div style={{ fontWeight: 'bold' }}>算法:</div>
                {algorithmSelector}
              </div>
            </Col>
            <Col span={12}>
              <Input
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                addonBefore="密钥"
                placeholder="请输入密钥"
              />
            </Col>
          </Row>
        </Card>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
            {mode === 'encrypt' ? "原文" : "密文"}
          </div>
          <TextArea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 6 }}
            placeholder={mode === 'encrypt' ? "请输入待加密的原文" : "请输入待解密的密文"}
          />
        </div>

        {operationButtons}

        <div>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
            {mode === 'encrypt' ? "密文" : "原文"}
          </div>
          <TextArea
            value={cipherText}
            onChange={(e) => setCipherText(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 6 }}
            placeholder={mode === 'encrypt' ? "加密结果将显示在这里" : "解密结果将显示在这里"}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default memo(SymmetricEncryption);
