import { Fragment, memo, useCallback, useMemo, useState } from "react";
import { Button, Card, Col, Input, message, Radio, Row, Select, Space, Tabs, Alert } from "antd";
import styles from "./styles.module.scss";

const { TextArea } = Input;
const { Group: RadioGroup } = Radio;
const { TabPane } = Tabs;

const AsymmetricEncryption = () => {
  // 原文
  const [originalText, setOriginalText] = useState<string>('');
  // 密文/签名
  const [cipherText, setCipherText] = useState<string>('');
  // 选择的算法
  const [algorithm, setAlgorithm] = useState<string>('RSA');
  // 操作模式 (加密/解密)
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  // 公钥
  const [publicKey, setPublicKey] = useState<string>('');
  // 私钥
  const [privateKey, setPrivateKey] = useState<string>('');
  // 密钥长度
  const [keySize, setKeySize] = useState<number>(2048);
  // 密钥格式说明
  const [keyFormatInfo, setKeyFormatInfo] = useState<string>('PKCS#8');

  // 支持的算法列表
  const algorithms = useMemo(() => [
    { label: 'RSA', value: 'RSA' },
    { label: 'DSA', value: 'DSA' },
    { label: 'ECC', value: 'ECC' },
  ], []);

  // 密钥长度选项
  const keySizes = useMemo(() => [
    { label: '1024位', value: 1024 },
    { label: '2048位', value: 2048 },
    { label: '4096位', value: 4096 }
  ], []);

  // 获取 forge 库
  const getForge = async () => {
    // 动态导入 node-forge 库
    return await import('node-forge');
  };

  // 生成密钥对
  const generateKeyPair = useCallback(async () => {
    try {
      const forge = await getForge();

      switch (algorithm) {
        case 'RSA':
          // RSA 密钥对生成
          const rsaKeyPair = forge.pki.rsa.generateKeyPair(keySize);
          setPublicKey(forge.pki.publicKeyToPem(rsaKeyPair.publicKey));
          setPrivateKey(forge.pki.privateKeyToPem(rsaKeyPair.privateKey));
          setKeyFormatInfo('PKCS#8');
          message.success(`${algorithm} 密钥对生成成功`);
          break;

        case 'DSA':
          message.info('DSA密钥对生成需要服务端支持，请使用专业工具生成');
          break;

        case 'ECC':
          message.info('ECC密钥对生成需要服务端支持，请使用专业工具生成');
          break;

        default:
          message.error('不支持的算法');
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(`密钥对生成失败: ${error.message}`);
      } else {
        message.error('密钥对生成失败');
      }
    }
  }, [algorithm, keySize]);

  // 加密函数 (使用 PKCS#1 v1.5 填充)
  const encrypt = useCallback(async (text: string, publicKeyPem: string) => {
    try {
      const forge = await getForge();

      // 将 PEM 格式的公钥转换为 forge 公钥对象
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

      // 将文本转换为字节
      const textBytes = forge.util.encodeUtf8(text);

      // 使用公钥加密 (使用默认的 PKCS#1 v1.5 填充)
      const encrypted = publicKey.encrypt(textBytes, 'RSAES-PKCS1-V1_5');

      // 将加密结果转换为 base64 格式
      return forge.util.encode64(encrypted);
    } catch (error) {
      if (error instanceof Error) {
        message.error(`加密失败: ${error.message}`);
      } else {
        message.error('加密失败');
      }
      return '';
    }
  }, []);

  // 解密函数 (使用 PKCS#1 v1.5 填充)
  const decrypt = useCallback(async (cipher: string, privateKeyPem: string) => {
    try {
      const forge = await getForge();

      // 将 PEM 格式的私钥转换为 forge 私钥对象
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

      // 将 base64 格式的密文转换为二进制数据
      const encryptedBytes = forge.util.decode64(cipher);

      // 使用私钥解密 (使用默认的 PKCS#1 v1.5 填充)
      const decrypted = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');

      // 将解密结果转换为 UTF-8 字符串
      return forge.util.decodeUtf8(decrypted);
    } catch (error) {
      if (error instanceof Error) {
        message.error(`解密失败: ${error.message}`);
      } else {
        message.error('解密失败');
      }
      return '';
    }
  }, []);

  // 签名函数
  const sign = useCallback(async (text: string, privateKeyPem: string) => {
    try {
      const forge = await getForge();

      // 将 PEM 格式的私钥转换为 forge 私钥对象
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

      // 创建 SHA-256 哈希
      const md = forge.md.sha256.create();
      md.update(text, 'utf8');

      // 使用私钥签名
      const signature = privateKey.sign(md);

      // 将签名结果转换为 base64 格式
      return forge.util.encode64(signature);
    } catch (error) {
      if (error instanceof Error) {
        message.error(`签名失败: ${error.message}`);
      } else {
        message.error('签名失败');
      }
      return '';
    }
  }, []);

  // 验证签名函数
  const verify = useCallback(async (text: string, signature: string, publicKeyPem: string) => {
    try {
      const forge = await getForge();

      // 将 PEM 格式的公钥转换为 forge 公钥对象
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

      // 将 base64 格式的签名转换为二进制数据
      const signatureBytes = forge.util.decode64(signature);

      // 创建 SHA-256 哈希
      const md = forge.md.sha256.create();
      md.update(text, 'utf8');

      // 使用公钥验证签名
      return publicKey.verify(md.digest().bytes(), signatureBytes);
    } catch (error) {
      if (error instanceof Error) {
        message.error(`签名验证失败: ${error.message}`);
      } else {
        message.error('签名验证失败');
      }
      return false;
    }
  }, []);

  // 执行加密或解密操作
  const handleOperation = useCallback(async () => {
    if (!originalText) {
      message.warning('请输入内容');
      return;
    }

    if (mode === 'encrypt') {
      if (!publicKey && algorithm === 'RSA') {
        message.warning('请先生成密钥对或输入公钥');
        return;
      }

      if (algorithm === 'RSA') {
        const result = await encrypt(originalText, publicKey);
        setCipherText(result);
      } else {
        message.info(`${algorithm}算法在浏览器环境中不支持加密操作，请使用专业工具`);
      }
    } else {
      if (!privateKey && algorithm === 'RSA') {
        message.warning('请先生成密钥对或输入私钥');
        return;
      }

      if (algorithm === 'RSA') {
        try {
          const result = await decrypt(originalText, privateKey);
          setCipherText(result);
        } catch (error) {
          message.error('解密失败，请检查密文和密钥是否正确');
        }
      } else {
        message.info(`${algorithm}算法在浏览器环境中不支持解密操作，请使用专业工具`);
      }
    }
  }, [algorithm, decrypt, encrypt, mode, originalText, privateKey, publicKey]);

  // 执行签名或验证操作
  const handleSignOperation = useCallback(async () => {
    if (!originalText) {
      message.warning('请输入内容');
      return;
    }

    if (mode === 'encrypt') {
      if (!privateKey && algorithm === 'RSA') {
        message.warning('请先生成密钥对或输入私钥');
        return;
      }

      if (algorithm === 'RSA') {
        const result = await sign(originalText, privateKey);
        setCipherText(result);
      } else {
        message.info(`${algorithm}算法在浏览器环境中签名功能需要服务端支持，请使用专业工具`);
      }
    } else {
      if (!publicKey && algorithm === 'RSA') {
        message.warning('请先生成密钥对或输入公钥');
        return;
      }

      if (algorithm === 'RSA') {
        try {
          const isValid = await verify(originalText, cipherText, publicKey);
          if (isValid) {
            message.success('签名验证成功');
          } else {
            message.error('签名验证失败');
          }
        } catch (error) {
          if (error instanceof Error) {
            message.error(`签名验证失败: ${error.message}`);
          } else {
            message.error('签名验证失败');
          }
        }
      } else {
        message.info(`${algorithm}算法在浏览器环境中验证功能需要服务端支持，请使用专业工具`);
      }
    }
  }, [algorithm, cipherText, mode, originalText, privateKey, publicKey, sign, verify]);

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

  // 根据算法显示不同的提示信息
  const renderAlgorithmAlert = useMemo(() => {
    switch (algorithm) {
      case 'RSA':
        return (
          <Alert
            message="RSA算法说明"
            description="RSA算法支持加密/解密和签名/验证操作。请选择操作模式并生成密钥对开始使用。"
            type="info"
            showIcon
          />
        );
      case 'DSA':
        return (
          <Alert
            message="DSA算法说明"
            description="DSA算法仅支持数字签名，不支持加密/解密。在浏览器环境中，DSA操作需要服务端支持，建议使用专业工具生成密钥对和进行签名操作。"
            type="warning"
            showIcon
          />
        );
      case 'ECC':
        return (
          <Alert
            message="ECC算法说明"
            description="ECC算法支持数字签名，相比RSA使用更短的密钥。在浏览器环境中，ECC操作需要服务端支持，建议使用专业工具生成密钥对和进行签名操作。"
            type="warning"
            showIcon
          />
        );
      default:
        return null;
    }
  }, [algorithm]);

  return (
    <Fragment>
      <h1>非对称加密</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="加解密操作" key="1">
          <div className={styles['operation-container']}>
            {renderAlgorithmAlert}

            <Card title="加密设置" style={{ marginBottom: 20, marginTop: 20 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div
                    style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontWeight: 'bold' }}>算法:</div>
                    {algorithmSelector}
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontWeight: 'bold' }}>操作:</div>
                    <RadioGroup
                      options={[
                        { label: '加密/签名', value: 'encrypt' },
                        { label: '解密/验证', value: 'decrypt' }
                      ]}
                      onChange={(e) => setMode(e.target.value)}
                      value={mode}
                      optionType="button"
                      buttonStyle="solid"
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="密钥管理" style={{ marginBottom: 20 }}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Space>
                    <span>密钥长度:</span>
                    <Select
                      value={keySize}
                      onChange={setKeySize}
                      options={keySizes}
                      disabled={algorithm !== 'RSA'}
                    />
                  </Space>
                </Col>
                <Col span={12}>
                  <Button type="primary" onClick={generateKeyPair}>
                    生成{algorithm}密钥对
                  </Button>
                </Col>
                <Col span={6}>
                  <div>密钥格式: {keyFormatInfo}</div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>公钥</div>
                  <TextArea
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    placeholder="公钥将在此显示"
                  />
                </Col>
                <Col span={12}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>私钥</div>
                  <TextArea
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    placeholder="私钥将在此显示"
                  />
                </Col>
              </Row>
            </Card>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                {mode === 'encrypt' ? "原文" : "密文/签名"}
              </div>
              <TextArea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                autoSize={{ minRows: 4, maxRows: 6 }}
                placeholder={mode === 'encrypt' ? "请输入待处理的内容" : "请输入待解密的密文或待验证的签名"}
              />
            </div>

            <div className={styles['btn-group']}>
              <Button
                type="primary"
                onClick={handleOperation}
              >
                {mode === 'encrypt' ? '加密' : '解密'}
              </Button>
              <Button
                onClick={handleSignOperation}
              >
                {mode === 'encrypt' ? '签名' : '验证签名'}
              </Button>
              <Button
                onClick={() => setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')}
              >
                切换到{mode === 'encrypt' ? '解密/验证' : '加密/签名'}
              </Button>
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                {mode === 'encrypt' ? "结果" : "验证结果"}
              </div>
              <TextArea
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
                autoSize={{ minRows: 4, maxRows: 6 }}
                placeholder={mode === 'encrypt' ? "处理结果将显示在这里" : "验证结果将显示在这里"}
              />
            </div>
          </div>
        </TabPane>

        <TabPane tab="算法介绍" key="2">
          <Card title="非对称加密算法介绍">
            <h3>RSA算法</h3>
            <p>RSA是最流行的公钥加密算法之一，基于大整数因式分解的数学难题。支持加密/解密和数字签名功能。</p>
            <ul>
              <li>密钥长度通常为1024位、2048位或4096位</li>
              <li>可以用于加密数据和数字签名</li>
              <li>速度相对较慢，通常用于加密少量数据或对称密钥</li>
              <li>在本工具中，加密使用PKCS#1 v1.5填充，签名使用SHA-256</li>
            </ul>

            <h3>DSA算法</h3>
            <p>DSA（Digital Signature Algorithm）是专门用于数字签名的算法，不支持加密。</p>
            <ul>
              <li>只能用于数字签名，不能用于加密</li>
              <li>基于离散对数问题</li>
              <li>签名速度快，验证速度也较快</li>
              <li>在本工具中，浏览器环境仅提供说明信息，实际使用建议通过专业工具</li>
            </ul>

            <h3>ECC算法</h3>
            <p>ECC（Elliptic Curve Cryptography）椭圆曲线密码学，使用椭圆曲线数学原理。</p>
            <ul>
              <li>相同安全级别下，密钥长度比RSA短得多</li>
              <li>计算效率高，资源消耗少</li>
              <li>适用于移动设备和资源受限环境</li>
              <li>在本工具中，浏览器环境仅提供说明信息，实际使用建议通过专业工具</li>
            </ul>

            <h3>DH算法</h3>
            <p>DH（Diffie-Hellman）算法用于密钥交换，允许双方在不安全的信道上协商共享密钥。</p>
            <ul>
              <li>专门用于密钥交换，不用于加密或签名</li>
              <li>基于离散对数问题</li>
              <li>是许多安全协议的基础</li>
            </ul>
          </Card>
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

export default memo(AsymmetricEncryption);
