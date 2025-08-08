import { CSSProperties, memo, ReactNode, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from "antd";
import { LanguageSupport } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import styles from "./styles.module.scss";
import { formatCode } from "@utils/format-utils";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { EditorSelection, EditorState, StateEffect, StateField } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { autocompletion } from "@codemirror/autocomplete";

type CodeType = 'css' | 'html' | 'javascript' | 'typescript' | 'json' | 'markdown'|'sql' | 'text'

export interface ICodeEditorRef {
  doFormatCode: () => Promise<string | null>
}

interface ICodeEditorProps {
  value: string
  language: CodeType
  onChange: (value: string) => void

  onFormatError?: (error?: FormatError) => void
  ref?: Ref<ICodeEditorRef>
  editorStyle?: CSSProperties
  containerStyle?: CSSProperties
  showFormat?: boolean
  children?: ReactNode
}

export interface FormatError {
  loc: {
    start: {
      line: number,
      column: number
    }
  },
  cause: {
    code: string,
    reasonCode: string,
    loc: {
      line: number,
      column: number,
      index: number
    },
    pos: number
  },
  codeFrame: string
}

const CodeEditor = (props: ICodeEditorProps) => {

  const editorContainer = useRef<HTMLDivElement>(null)

  const langConfig: {
    [key in CodeType]: {
      extension?: LanguageSupport,
      format: 'babel' | 'json' | 'html' | 'css' | 'markdown' | 'text' | 'typescript' | 'sql'
    }
  } = {
    javascript: {
      extension: javascript({
        typescript: false,
        jsx: true
      }),
      format: 'babel'
    },
    json: {
      extension: json(),
      format: 'json'
    },
    html: {
      extension: html(),
      format: 'html'
    },
    css: {
      extension: css(),
      format: 'css'
    },
    markdown: {
      extension: markdown(),
      format: 'markdown'
    },
    text: {
      extension: undefined,
      format: 'text'
    },
    typescript: {
      extension: javascript({
        typescript: true,
        jsx: true
      }),
      format: 'typescript'
    },
    sql: {
      extension: sql(),
      format: 'sql'
    }
  }

  const [code, setCode] = useState(props.value)
  const [editorView, setEditorView] = useState<EditorView>()

  // 定义添加和移除高亮的状态效果
  const addHighlight = useRef(StateEffect.define<DecorationSet | null>({
    map: (range, change) => range && range.map(change)
  }))

  const removeHighlight = useRef(StateEffect.define())

  // 创建管理高亮装饰的状态字段
  const highlightField = useRef(StateField.define<DecorationSet>({
    create() {
      return Decoration.none
    },
    update(deco, tr) {
      // 处理添加和移除高亮的效果
      deco = deco.map(tr.changes)
      for (const effect of tr.effects) {
        if (effect.is(addHighlight.current) && effect.value) {
          deco = deco.update({ add: [(effect.value as never)] })
        } else if (effect.is(removeHighlight.current)) {
          deco = Decoration.none
        }
      }
      return deco
    },
    provide: (f) => EditorView.decorations.from(f)
  }))

  useEffect(() => {
    if (!editorContainer.current) return
    setEditorView(new EditorView({
      state: EditorState.create({
        doc: props.value || '',
        extensions: [
          basicSetup,
          langConfig[props.language].extension,
          EditorView.lineWrapping,
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              const code = update.state.doc.toString()
              setCode(code)
              props.onChange(code)
            }
          }),
          highlightField.current,
          autocompletion({
            activateOnTyping: true,
            maxRenderedOptions: 20,
            defaultKeymap: true,
          }),
        ].filter(a => !!a)
      }),
      parent: editorContainer.current!
    }))
    return () => {
      if (editorView) {
        editorView.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (props.value !== code && editorView) {
      const transaction = editorView.state.update({
        changes: { from: 0, to: editorView.state.doc.length, insert: props.value }
      })
      editorView.dispatch(transaction)
    }
  }, [props.value])

  useImperativeHandle<ICodeEditorRef, ICodeEditorRef>(props.ref, () => ({
    doFormatCode,
  }))

  // 格式化代码
  const doFormatCode = async () => {
    if (!editorView) return null
    let formattedText
    try {
      const currentText = editorView.state.doc.toString()
      formattedText = await formatCode(currentText, langConfig[props.language].format)
      editorView.dispatch({
        changes: { from: 0, to: currentText.length, insert: formattedText }
      })
      props.onFormatError?.()
    } catch (error) {
      const line = (error as FormatError).loc.start.line
      handle(line)
      props.onFormatError?.(error as FormatError)
      return null
    }
    return formattedText
  }

  // 高亮报错行
  const handle = (line: number) => {
    if (!editorView) return
    if (line === 0) {
      editorView.dispatch({
        effects: removeHighlight.current.of(null)
      })
      return
    }
    const lineObj = editorView.state.doc.line(line)
    const highlightTheme = Decoration.line({
      attributes: {
        style: 'background-color: rgb(255, 229, 224)'
      }
    })
    const deco = highlightTheme.range(lineObj.from)

    editorView.dispatch({
      effects: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        addHighlight.current.of(deco),
        EditorView.scrollIntoView(EditorSelection.range(editorView.state.doc.line(line).from, editorView.state.doc.line(line).to)),
      ]
    })
  }

  return (
    <div
      className={styles.container}
      style={props.containerStyle}
    >
      <div
        ref={editorContainer}
        className={styles.editor}
        style={props.editorStyle}
      />
      <div className={styles['extension-action']}>
        {props.showFormat ?
          <Button onClick={doFormatCode}>
            格式化
          </Button>
          : null}
        {props.children}
      </div>
    </div>
  )
}

export default memo(CodeEditor)
