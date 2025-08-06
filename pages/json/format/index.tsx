import { Fragment, memo, useState } from "react";
import CodeEditor, { FormatError } from "@pages/_components/CodeEditor";
import { Alert, Button } from "antd";

const JsonFormat = () => {

  const [jsonStr, setJsonStr] = useState('')

  const [formatErrorMessage, setFormatErrorMessage] = useState('')

  const handleFormatError = (e?: FormatError) => {
    setFormatErrorMessage(e?.codeFrame || '')
  }
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
        <Button onClick={() => setJsonStr('')}>清空</Button>
      </CodeEditor>
      {formatErrorMessage ?
        <Alert
          message={<pre>{formatErrorMessage}</pre>}
          type="error"
        />
        : null}
    </Fragment>
  )
}

export default memo(JsonFormat)
