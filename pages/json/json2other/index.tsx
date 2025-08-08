import { Fragment, useState, useEffect } from "react";
import CodeEditor, { FormatError } from "@pages/_components/CodeEditor";
import { Alert, Button, Radio, Space, Input } from "antd";
import {
  generateJavaScriptClass,
  generateTypeScriptInterface,
  generatePythonClass,
  generateJavaClass,
  generateCppClass,
  generateJsonSchema,
  generateGoStruct,
  generateRustStruct,
  generateObjectiveCClass,
  generateSwiftStruct,
  generateCrystalClass,
  generateJSPropTypes,
  generateFlowType,
  generateKotlinDataClass,
  generateElmType,
  generateRubyClass,
  generatePikeClass,
  generateHaskellType
} from "@utils/jsonToOtherLanguages";
import styles from './styles.module.scss';
import { RadioChangeEvent } from "antd/es/radio/interface";

const { TextArea } = Input;

const JsonToOther = () => {
  const [jsonStr, setJsonStr] = useState('');
  const [resultStr, setResultStr] = useState('');
  const [formatErrorMessage, setFormatErrorMessage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('javascript');

  const handleFormatError = (e?: FormatError) => {
    setFormatErrorMessage(e?.codeFrame || '');
  };

  // 转换函数
  const convertJson = (language: string = targetLanguage, jsonData: string = jsonStr) => {
    if (!jsonData.trim()) {
      setResultStr('');
      setFormatErrorMessage('');
      return;
    }

    try {
      // 先验证JSON格式是否正确
      const parsed = JSON.parse(jsonData);

      let result: string;
      switch (language) {
        case 'javascript':
          result = generateJavaScriptClass(parsed);
          break;
        case 'typescript':
          result = generateTypeScriptInterface(parsed);
          break;
        case 'python':
          result = generatePythonClass(parsed);
          break;
        case 'java':
          result = generateJavaClass(parsed);
          break;
        case 'cpp':
          result = generateCppClass(parsed);
          break;
        case 'jsonschema':
          result = generateJsonSchema(parsed);
          break;
        case 'go':
          result = generateGoStruct(parsed);
          break;
        case 'rust':
          result = generateRustStruct(parsed);
          break;
        case 'objectivec':
          result = generateObjectiveCClass(parsed);
          break;
        case 'swift':
          result = generateSwiftStruct(parsed);
          break;
        case 'crystal':
          result = generateCrystalClass(parsed);
          break;
        case 'jsproptypes':
          result = generateJSPropTypes(parsed);
          break;
        case 'flow':
          result = generateFlowType(parsed);
          break;
        case 'kotlin':
          result = generateKotlinDataClass(parsed);
          break;
        case 'elm':
          result = generateElmType(parsed);
          break;
        case 'ruby':
          result = generateRubyClass(parsed);
          break;
        case 'pike':
          result = generatePikeClass(parsed);
          break;
        case 'haskell':
          result = generateHaskellType(parsed);
          break;
        default:
          result = '暂不支持该语言';
      }

      setResultStr(result);
      setFormatErrorMessage('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setFormatErrorMessage(e.message || 'JSON格式错误');
      } else {
        setFormatErrorMessage('JSON格式错误');
      }
      setResultStr('');
    }
  };

  // 当语言或JSON数据变化时自动转换
  useEffect(() => {
    convertJson(targetLanguage, jsonStr);
  }, [targetLanguage, jsonStr]);

  const handleCopy = () => {
    navigator.clipboard.writeText(resultStr);
  };

  const handleLanguageChange = (e: RadioChangeEvent) => {
    setTargetLanguage(e.target.value);
  };

  return (
    <Fragment>
      <h1>JSON转其他语言</h1>
      <div className={styles.languageSelector}>
        <span>目标语言:</span>
        <Radio.Group
          value={targetLanguage}
          onChange={handleLanguageChange}
          style={{ marginLeft: 8 }}
        >
          <Radio.Button value="javascript">JavaScript</Radio.Button>
          <Radio.Button value="typescript">TypeScript</Radio.Button>
          <Radio.Button value="python">Python</Radio.Button>
          <Radio.Button value="java">Java</Radio.Button>
          <Radio.Button value="cpp">C++</Radio.Button>
          <Radio.Button value="go">Go</Radio.Button>
          <Radio.Button value="rust">Rust</Radio.Button>
          <Radio.Button value="swift">Swift</Radio.Button>
          <Radio.Button value="objectivec">Objective-C</Radio.Button>
          <Radio.Button value="jsonschema">JSON Schema</Radio.Button>
          <Radio.Button value="crystal">Crystal</Radio.Button>
          <Radio.Button value="jsproptypes">JS PropTypes</Radio.Button>
          <Radio.Button value="flow">Flow</Radio.Button>
          <Radio.Button value="kotlin">Kotlin</Radio.Button>
          <Radio.Button value="elm">Elm</Radio.Button>
          <Radio.Button value="ruby">Ruby</Radio.Button>
          <Radio.Button value="pike">Pike</Radio.Button>
          <Radio.Button value="haskell">Haskell</Radio.Button>
        </Radio.Group>
      </div>
      <CodeEditor
        language="json"
        value={jsonStr}
        onChange={setJsonStr}
        editorStyle={{ maxHeight: 300 }}
        onFormatError={handleFormatError}
      >
        <Space wrap>
          <Button onClick={() => setJsonStr('')}>清空</Button>
        </Space>
      </CodeEditor>

      {formatErrorMessage ? (
        <Alert
          message={<pre>{formatErrorMessage}</pre>}
          type="error"
          className={styles.errorAlert}
        />
      ) : null}

      <div className={styles.resultContainer}>
        <div className={styles.resultHeader}>
          <span className={styles.resultTitle}>
            {targetLanguage === 'javascript' ? 'JavaScript类' :
              targetLanguage === 'typescript' ? 'TypeScript接口' :
                targetLanguage === 'python' ? 'Python类' :
                  targetLanguage === 'java' ? 'Java类' :
                    targetLanguage === 'cpp' ? 'C++类' :
                      targetLanguage === 'go' ? 'Go结构体' :
                        targetLanguage === 'rust' ? 'Rust结构体' :
                          targetLanguage === 'swift' ? 'Swift结构体' :
                            targetLanguage === 'objectivec' ? 'Objective-C类' :
                              targetLanguage === 'jsonschema' ? 'JSON Schema' :
                                targetLanguage === 'crystal' ? 'Crystal类' :
                                  targetLanguage === 'jsproptypes' ? 'JS PropTypes' :
                                    targetLanguage === 'flow' ? 'Flow类型' :
                                      targetLanguage === 'kotlin' ? 'Kotlin数据类' :
                                        targetLanguage === 'elm' ? 'Elm类型' :
                                          targetLanguage === 'ruby' ? 'Ruby类' :
                                            targetLanguage === 'pike' ? 'Pike类' :
                                              targetLanguage === 'haskell' ? 'Haskell类型' :
                                                `${targetLanguage}结构`}
          </span>
          <Button onClick={handleCopy} disabled={!resultStr}>复制结果</Button>
        </div>
        <TextArea
          value={resultStr}
          readOnly
          autoSize={{ minRows: 4, maxRows: 20 }}
          style={{ fontFamily: 'monospace' }}
        />
      </div>
    </Fragment>
  );
};

export default JsonToOther;
