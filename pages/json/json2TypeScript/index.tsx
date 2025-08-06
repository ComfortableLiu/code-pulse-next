import { Fragment, memo, useCallback, useRef, useState } from "react";
import CodeEditor, { FormatError, ICodeEditorRef } from "@pages/_components/CodeEditor";
import { Alert, Button } from "antd";
import { IAnyObj } from "@code-pulse-next/backend/src/type";

const JsonToTypescript = () => {

  // json内容
  const [jsonStr, setJsonStr] = useState('')
  const [typescriptStr, setTypescriptStr] = useState('')
  const [formatErrorMessage, setFormatErrorMessage] = useState('')

  // 持有ts组件的ref，为了调用其格式化代码
  const tsEditorRef = useRef<ICodeEditorRef>(null)
  // 持有json组件的ref，为了调用其格式化代码
  const jsonEditorRef = useRef<ICodeEditorRef>(null)

  const handleFormatError = (e?: FormatError) => {
    setFormatErrorMessage(e?.codeFrame || '')
  }

  const handle = (obj: IAnyObj, name: string) => {
    const t: IAnyObj = {}
    const list: { obj: IAnyObj, name: string }[] = []
    Object.keys(obj || []).forEach(key => {
      // 将key，按照key中的非字母数字的所有字符进行切分
      // 为了处理字符串的特殊情况，比如"@abc/def_123:4.5.66-qqq"，需要处理成"IAbcDef1234566Qqq"
      const keyStr = key.split(/[^A-Za-z0-9]/)
        .filter(Boolean)
        .map((key, index) => index > 0 ? key.charAt(0).toUpperCase() + key.slice(1) : key)
        .join('') || 'unknownName'

      // 处理非对象
      if (typeof obj[key] !== 'object') {
        t[keyStr] = typeof obj[key]
        return
      }

      // 处理对象
      t[keyStr] = `I${keyStr.charAt(0).toUpperCase() + keyStr.slice(1)}`
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 0) {
          t[keyStr] = 'any[]'
          return
        } else if (typeof obj[key][0] !== 'object') {
          t[keyStr] = typeof obj[key][0] + '[]'
          return
        } else {
          t[keyStr] += '[]'
        }
      }
      list.push({
        obj: Array.isArray(obj[key]) ? obj[key][0] : obj[key],
        name: keyStr,
      })
    })
    return {
      list,
      str: `interface I${name.charAt(0).toUpperCase() + name.slice(1)} {\n${Object.keys(t).map(key => `  ${key}: ${t[key]}`).join('\n')}\n}\n\n`,
    }
  }

  const transformTypescript = useCallback((text?: string) => {
    let ans = ''
    const obj = JSON.parse(text || jsonStr)
    const list = []
    list.push({
      obj,
      name: 'root',
    })
    while (list.length) {
      const item = list.shift()!
      const { list: newList, str } = handle(item.obj, item.name)
      ans += str
      // 将所有newList里面的元素添加到list里面
      newList.forEach(item => list.push(item))
    }
    setTypescriptStr(ans)
    setTimeout(() => tsEditorRef.current?.doFormatCode?.())
  }, [jsonStr])

  return (
    <Fragment>
      <h1>JSON转Typescript</h1>
      <CodeEditor
        ref={jsonEditorRef}
        value={jsonStr}
        onChange={setJsonStr}
        language="json"
        showFormat
        style={{ maxHeight: 300 }}
        onFormatError={handleFormatError}
      >
        <Button className="button" onClick={() => setJsonStr('')}>清空</Button>
        <Button
          className="button"
          type="primary"
          onClick={async () => {
            const text = await jsonEditorRef.current?.doFormatCode?.()
            if (!text) return
            transformTypescript(text)
          }}
        >
          转换
        </Button>
        {/* <!--        <a-checkbox>-->*/}
        {/* <!--          需要分号-->*/}
        {/* <!--        </a-checkbox>-->*/}
        {/* <!--        <a-checkbox>-->*/}
        {/* <!--          添加导出-->*/}
        {/* <!--        </a-checkbox>-->*/}
      </CodeEditor>
      <br />
      {formatErrorMessage ?
        <Alert
          message={<pre>{formatErrorMessage}</pre>}
          type="error"
        />
        : null}
      <br />
      <CodeEditor
        ref={tsEditorRef}
        value={typescriptStr}
        onChange={setTypescriptStr}
        language="typescript"
        show-format
        style={{ maxHeight: 300 }}
      />
    </Fragment>
  )
}

export default memo(JsonToTypescript)
