import React, { useCallback, useRef, useState } from 'react';
import CodeEditor, { FormatError, ICodeEditorRef } from '@pages/_components/CodeEditor';
import styles from './styles.module.scss';
import { formatCode } from '@utils/format-utils';

const SqlFormatter: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const editorRef = useRef<ICodeEditorRef>(null);

  const formatCodeHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const formatted = await formatCode(inputCode, 'sql');
      setInputCode(formatted);
    } catch (err) {
      setError('格式化失败: ' + (err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputCode]);

  // 完全压缩 - 移除所有不必要的字符
  const fullCompressHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      let result = inputCode;
      // 移除注释
      result = result.replace(/--.*$/gm, '');
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      // 移除所有多余空白字符
      result = result.replace(/\s+/g, ' ');
      // 移除关键字前后的空格（保守方式）
      result = result.replace(/\s*([(),;])\s*/g, '$1');
      // 移除开头和结尾的空白字符
      result = result.trim();
      // 移除所有换行符
      result = result.replace(/\n/g, '');

      setInputCode(result);
    } catch (err) {
      setError('完全压缩失败: ' + (err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputCode]);

  const handleClear = () => {
    setInputCode('');
    setError(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputCode);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleFormatError = (error?: FormatError) => {
    if (error) {
      setError(`格式化失败: 第${error.loc.start.line}行，第${error.loc.start.column}列`);
    } else {
      setError(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className="container mx-auto px-4">
        <div className={styles.header}>
          <h1 className={styles.title}>SQL格式化/压缩工具</h1>
          <p className={styles.description}>快速格式化和压缩您的SQL代码，使其更易读或更紧凑</p>
        </div>

        <div className={styles.card}>
          <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
              <h2 className={styles.editorTitle}>SQL编辑器</h2>
              <div className={styles.buttonGroup}>
                <button
                  onClick={handleCopy}
                  className={styles.copyButton}
                  disabled={isLoading}
                >
                  复制
                </button>
                <button
                  onClick={handleClear}
                  className={styles.clearButton}
                  disabled={isLoading}
                >
                  清空
                </button>
              </div>
            </div>

            <CodeEditor
              ref={editorRef}
              value={inputCode}
              language="sql"
              onChange={(value) => setInputCode(value || '')}
              onFormatError={handleFormatError}
            />

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <div className={styles.buttonGroup}>
              <button
                onClick={formatCodeHandler}
                disabled={isLoading || !inputCode.trim()}
                className={styles.formatButton}
              >
                {isLoading ? '处理中...' : '格式化'}
              </button>

              <button
                onClick={fullCompressHandler}
                disabled={isLoading || !inputCode.trim()}
                className={styles.minifyButton}
              >
                {isLoading ? '处理中...' : '压缩'}
              </button>
            </div>

            <div className={styles.description}>
              <h3>功能说明：</h3>
              <ul>
                <li><strong>格式化：</strong>美化SQL代码格式，添加适当的缩进和换行</li>
                <li><strong>压缩：</strong>移除所有不必要的字符、空格和换行，使代码最紧凑</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlFormatter;
