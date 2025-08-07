import { Fragment, useCallback, useMemo, useState, useRef } from "react";
import { Button, message, Typography } from "antd";
import CodeEditor, { ICodeEditorRef } from "@pages/_components/CodeEditor";
import styles from "./styles.module.scss";

const { Text } = Typography;

const JsEvalEncryption = () => {
  // 原始代码
  const [originalCode, setOriginalCode] = useState<string>('');
  // 加密后代码
  const [encryptedCode, setEncryptedCode] = useState<string>('');
  // 操作模式 (加密/解密)
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const [messageApi, contextHolder] = message.useMessage();

  const encryptedCodeEditorRef = useRef<ICodeEditorRef>(null);

  // 加密函数
  const encrypt = useCallback((code: string) => {
    try {
      // 将代码转换为十六进制字符串
      const hexEncoded = code.split('').map(char =>
        char.charCodeAt(0).toString(16).padStart(2, '0')
      ).join('');

      // 构造 eval 解密代码
      return `eval((function(str){return unescape(str.replace(/../g,function(m){return '%'+m}))})('${hexEncoded}'))`;
    } catch (error) {
      messageApi.error(`加密失败: ${error}`);
      return '';
    }
  }, [messageApi]);

  // 解密函数
  const decrypt = useCallback((code: string) => {
    try {
      // 匹配 eval 加密模式
      const evalRegex = /eval\(\(function\(str\)\{return unescape\(str\.replace\(\/\.\.\/g,function\(m\)\{return '%'\+m\}\)\)\}\)\('[0-9a-fA-F]*'\)\)/;
      const match = code.match(evalRegex);

      if (match) {
        // 提取十六进制字符串
        const hexString = match[0].match(/'([0-9a-fA-F]*)'/)?.[1] || '';

        // 解码十六进制字符串
        let decoded = '';
        for (let i = 0; i < hexString.length; i += 2) {
          decoded += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
        }

        return decoded;
      } else {
        messageApi.warning('未检测到标准的 eval 加密格式');
        return code;
      }
    } catch (error) {
      messageApi.error(`解密失败: ${error}`);
      return '';
    }
  }, [messageApi]);

  // 执行加密或解密操作
  const handleOperation = useCallback(() => {
    if (!originalCode) {
      messageApi.warning('请输入代码');
      return;
    }

    if (mode === 'encrypt') {
      const result = encrypt(originalCode);
      setEncryptedCode(result);
    } else {
      try {
        const result = decrypt(originalCode);
        setEncryptedCode(result);
      } catch (error) {
        messageApi.error('解密失败，请检查代码格式是否正确');
      }
    }
  }, [originalCode, mode, messageApi, encrypt, decrypt]);

  // 交换原文和密文
  const swapTexts = useCallback(() => {
    const temp = originalCode;
    setOriginalCode(encryptedCode);
    setEncryptedCode(temp);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  }, [encryptedCode, mode, originalCode]);

  // 操作按钮组
  const operationButtons = useMemo(() => (
    <div className={styles['btn-group']}>
      <Button
        type="primary"
        onClick={handleOperation}
        size="large"
      >
        {mode === 'encrypt' ? '加密' : '解密'}
      </Button>
      <Button
        onClick={swapTexts}
        size="large"
      >
        交换文本
      </Button>
      <Button
        onClick={() => setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')}
        size="large"
      >
        切换到{mode === 'encrypt' ? '解密' : '加密'}
      </Button>
    </div>
  ), [handleOperation, mode, swapTexts]);

  return (
    <Fragment>
      {contextHolder}
      <h1>JS Eval 加解密</h1>

      <div className={styles['operation-container']}>
        <div className={styles['section']}>
          <div className={styles['section-title']}>
            {mode === 'encrypt' ? "原始代码" : "待解密代码"}
          </div>
          <CodeEditor
            value={originalCode}
            language="javascript"
            onChange={setOriginalCode}
            editorStyle={{ maxHeight: 300 }}
          />
        </div>

        {operationButtons}

        <div className={styles['section']}>
          <div className={styles['section-title']}>
            {mode === 'encrypt' ? "加密结果" : "解密结果"}
          </div>
          <CodeEditor
            ref={encryptedCodeEditorRef}
            value={encryptedCode}
            language="javascript"
            onChange={setEncryptedCode}
            editorStyle={{ maxHeight: 300 }}
          />
        </div>
      </div>

      <div className={styles['info-section']}>
        <h3>说明</h3>
        <p>此工具可以对 JavaScript 代码进行简单的 eval 加密，将代码转换为十六进制字符串并通过 eval
          函数在运行时解密执行。</p>
        <Text type="warning">
          <p><strong>注意1：</strong>这种加密方式仅能提供简单的代码混淆，不能真正保护代码安全。请勿用于敏感信息处理。</p>
          <p><strong>注意2：</strong>当前只支持ASCII字符，unicode字符将无法正确处理。</p>
        </Text>
      </div>
    </Fragment>
  );
};

export default JsEvalEncryption;
