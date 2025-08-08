import React, { useState } from 'react';
import { JwtUtils } from '@utils/jwt';
import styles from "./styles.module.scss"
import { Button, Tabs } from "antd";

const JwtToolPage: React.FC = () => {
  const { TabPane } = Tabs;
  // 输入相关状态
  const [payload, setPayload] = useState<string>('{"userId": "123", "username": "testuser"}');
  const [secretKey, setSecretKey] = useState<string>('my_secret_key');
  const [expiresIn, setExpiresIn] = useState<string>('1h');
  const [tokenToDecode, setTokenToDecode] = useState<string>('');

  // 输出相关状态
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [decodedPayload, setDecodedPayload] = useState<string>('');
  const [decodedHeader, setDecodedHeader] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');

  // 生成JWT Token
  const handleGenerateToken = () => {
    try {
      const payloadObj = JSON.parse(payload);
      const token = JwtUtils.generateToken(payloadObj, secretKey, expiresIn);
      setGeneratedToken(token);
      // 清空解码结果
      setDecodedHeader('');
      setDecodedPayload('');
      setVerificationResult('');
    } catch (error) {
      alert('Payload格式错误，请输入有效的JSON格式');
    }
  };

  // 解码JWT Token
  const handleDecodeToken = () => {
    try {
      // 解码头部
      const header = JwtUtils.decodeHeader(tokenToDecode);
      setDecodedHeader(JSON.stringify(header, null, 2));

      // 解码载荷
      const payload = JwtUtils.decodePayload(tokenToDecode);
      setDecodedPayload(JSON.stringify(payload, null, 2));

      // 验证签名
      const isValid = JwtUtils.verifyToken(tokenToDecode, secretKey);
      setVerificationResult(isValid ? '验证通过' : '验证失败');

      // 清空生成结果
      setGeneratedToken('');
    } catch (error) {
      setDecodedHeader('解码失败');
      setDecodedPayload('解码失败');
      setVerificationResult('验证失败');
      setGeneratedToken('');
    }
  };

  return (
    <div className={styles['jwt-tool']}>
      <h2>JWT 加解密工具</h2>

      <div className={styles["tool-container"]}>
        <div className={styles["input-section"]}>
          <Tabs defaultActiveKey="encrypt">
            <TabPane tab="加密" key="encrypt">
              <div className={styles["form-group"]}>
                <label>载荷 (Payload):</label>
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={5}
                  cols={50}
                />
              </div>

              <div className={styles["form-group"]}>
                <label>过期时间:</label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                >
                  <option value="1m">1分钟</option>
                  <option value="15m">15分钟</option>
                  <option value="1h">1小时</option>
                  <option value="6h">6小时</option>
                  <option value="1d">1天</option>
                  <option value="7d">7天</option>
                </select>
              </div>

              <Button type="primary" onClick={handleGenerateToken}>生成 JWT Token</Button>
            </TabPane>

            <TabPane tab="解密" key="decrypt">
              <div className={styles["form-group"]}>
                <label>JWT Token:</label>
                <textarea
                  value={tokenToDecode}
                  onChange={(e) => setTokenToDecode(e.target.value)}
                  rows={5}
                  cols={80}
                />
              </div>

              <Button type="primary" onClick={handleDecodeToken}>解密 JWT Token</Button>
            </TabPane>
          </Tabs>

          <div className={styles["form-group"]}>
            <label>密钥 (Secret Key):</label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
        </div>

        <div className={styles["output-section"]}>
          <h3>输出结果</h3>

          {generatedToken && (
            <div className={styles.result}>
              <h4>生成的 Token:</h4>
              <textarea
                value={generatedToken}
                readOnly
                rows={5}
                cols={80}
              />
            </div>
          )}

          {decodedHeader && (
            <div className={styles.result}>
              <h4>头部 (Header):</h4>
              <pre>{decodedHeader}</pre>
            </div>
          )}

          {decodedPayload && (
            <div className={styles.result}>
              <h4>载荷 (Payload):</h4>
              <pre>{decodedPayload}</pre>
            </div>
          )}

          {verificationResult && (
            <div className={styles.result}>
              <h4>签名验证结果:</h4>
              <p className={verificationResult === '验证通过' ? styles.success : styles.error}>
                {verificationResult}
              </p>
            </div>
          )}

          {!generatedToken && !decodedHeader && !decodedPayload && !verificationResult && (
            <div className={styles.result}>
              <p>请在左侧选择操作并执行</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles["introduction"]}>
        <h3>JWT 简介</h3>
        <p><strong>JWT (JSON Web Token)</strong> 是一种开放标准 (RFC 7519)，用于在各方之间安全地传输信息。</p>

        <h4>JWT 的结构</h4>
        <ul>
          <li><strong>Header（头部）</strong>: 包含令牌类型和签名算法</li>
          <li><strong>Payload（载荷）</strong>: 包含声明信息（用户数据等）</li>
          <li><strong>Signature（签名）</strong>: 用于验证令牌的真实性</li>
        </ul>

        <h4>JWT 的特点</h4>
        <ul>
          <li>紧凑且自包含，可以安全地在各方之间传输</li>
          <li>可以包含用户信息，避免多次数据库查询</li>
          <li>可扩展性好，可以在载荷中添加自定义声明</li>
          <li>支持跨域认证</li>
        </ul>

        <h4>常见用途</h4>
        <ul>
          <li>身份验证</li>
          <li>信息交换</li>
          <li>单点登录 (SSO)</li>
          <li>API 访问授权</li>
        </ul>
      </div>
    </div>
  );
};

export default JwtToolPage;
