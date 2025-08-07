import { Fragment, memo, useState, useRef } from "react";
import CodeEditor, { FormatError, ICodeEditorRef } from "@pages/_components/CodeEditor";
import { Alert, Button, Space, Divider } from "antd";
import { IAnyObj } from "@utils/type";

const JsonFormat = () => {

  const [jsonStr, setJsonStr] = useState('')
  const [resultStr, setResultStr] = useState('')
  const [formatErrorMessage, setFormatErrorMessage] = useState('')

  const resultEditorRef = useRef<ICodeEditorRef>(null)

  const handleFormatError = (e?: FormatError) => {
    setFormatErrorMessage(e?.codeFrame || '')
  }

  const handleCompress = () => {
    try {
      // 先验证JSON格式是否正确
      const parsed = JSON.parse(jsonStr);
      // 重新序列化为压缩格式（单行）
      const compactJson = JSON.stringify(parsed, null, 0);
      setResultStr(compactJson);
      setFormatErrorMessage('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setFormatErrorMessage(e.message || 'JSON格式错误');
      } else {
        setFormatErrorMessage('JSON格式错误');
      }
    }
  };

  const handleEscape = () => {
    try {
      // 先验证JSON格式是否正确
      const parsed = JSON.parse(jsonStr);
      // 重新序列化为压缩格式
      const compactJson = JSON.stringify(parsed);
      // 转义引号和换行符等特殊字符
      const escapedJson = compactJson.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      setResultStr(escapedJson);
      setFormatErrorMessage('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setFormatErrorMessage(e.message || 'JSON格式错误');
      } else {
        setFormatErrorMessage('JSON格式错误');
      }
    }
  };

  const handleUnescape = () => {
    try {
      // 去除转义
      const unescaped = jsonStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      // 尝试解析去除转义后的JSON
      const parsed = JSON.parse(unescaped);
      // 重新格式化为标准JSON格式
      const formattedJson = JSON.stringify(parsed, null, 2);
      setResultStr(formattedJson);
      setFormatErrorMessage('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setFormatErrorMessage(e.message || 'JSON格式错误');
      } else {
        setFormatErrorMessage('JSON格式错误');
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultStr);
  };

  return (
    <Fragment>
      <h1>JSON格式化</h1>
      <CodeEditor
        showFormat
        language="json"
        value={jsonStr}
        onChange={setJsonStr}
        editorStyle={{ maxHeight: 300 }}
        onFormatError={handleFormatError}
      >
        <Space wrap>
          <Button onClick={() => setJsonStr('')}>清空</Button>
          <Button type="primary" onClick={handleCompress}>压缩</Button>
          <Button type="primary" onClick={handleEscape}>转义</Button>
          <Button type="primary" onClick={handleUnescape}>去除转义</Button>
        </Space>
      </CodeEditor>
      {formatErrorMessage ?
        <Alert
          message={<pre>{formatErrorMessage}</pre>}
          type="error"
        />
        : null}

      <br />

      {resultStr && (
        <div>
          <Divider>结果</Divider>
          <CodeEditor
            ref={resultEditorRef}
            language="json"
            value={resultStr}
            onChange={setResultStr}
            editorStyle={{ maxHeight: 300 }}
          >
            <Space>
              <Button onClick={() => setResultStr('')}>清空结果</Button>
              <Button type="primary" onClick={handleCopy}>复制结果</Button>
            </Space>
          </CodeEditor>
        </div>
      )}
    </Fragment>
  )
}

export default memo(JsonFormat)
