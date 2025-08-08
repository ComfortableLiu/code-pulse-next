import React, { useCallback, useRef, useState } from 'react';
import CodeEditor, { FormatError, ICodeEditorRef } from '@pages/_components/CodeEditor';
import styles from './styles.module.scss';

const CodeFormatter: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('typescript');
  const editorRef = useRef<ICodeEditorRef>(null);

  const formatCodeHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      await editorRef.current.doFormatCode();
    } catch (err) {
      setError('格式化失败: ' + (err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClear = () => {
    setInputCode('');
    setError(null);
  };

  const handleCopy = async () => {
    // 通过CodeEditor组件获取当前代码
    const textarea = document.querySelector(`.${styles.textarea}`) as HTMLTextAreaElement;
    if (textarea) {
      try {
        await navigator.clipboard.writeText(textarea.value);
      } catch (err) {
        console.error('复制失败:', err);
      }
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
          <h1 className={styles.title}>JavaScript/TypeScript代码格式化</h1>
          <p className={styles.description}>快速格式化您的JavaScript、TypeScript、JSX和TSX代码，使其更易读和维护</p>
        </div>

        <div className={styles.card}>
          <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
              <h2 className={styles.editorTitle}>代码编辑器</h2>
              <div className={styles.buttonGroup}>
                <button
                  onClick={handleCopy}
                  className={styles.copyButton}
                >
                  复制
                </button>
                <button
                  onClick={handleClear}
                  className={styles.clearButton}
                >
                  清空
                </button>
              </div>
            </div>

            <div className={styles.languageSelector}>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="language"
                    value="typescript"
                    checked={language === 'typescript'}
                    onChange={() => setLanguage('typescript')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>TypeScript/TSX</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="language"
                    value="javascript"
                    checked={language === 'javascript'}
                    onChange={() => setLanguage('javascript')}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>JavaScript/JSX</span>
                </label>
              </div>
            </div>

            <CodeEditor
              ref={editorRef}
              value={inputCode}
              language={language}
              onChange={setInputCode}
              onFormatError={handleFormatError}
              showFormat={false} // 我们使用自己的格式化按钮
              editorStyle={{ maxHeight: 400 }}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={formatCodeHandler}
              disabled={isLoading || !inputCode.trim()}
              className={`${styles.actionButton} ${
                isLoading || !inputCode.trim() ? styles.disabled : styles.enabled
              }`}
            >
              {isLoading ? '格式化中...' : '格式化代码'}
            </button>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
        </div>

        {/* 功能介绍 */}
        <div className={styles.card}>
          <h2 className={styles.featuresTitle}>关于代码格式化工具</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.feature} ${styles.featureBlue}`}>
              <h3 className={styles.featureTitle}>多语言支持</h3>
              <p className={styles.featureDescription}>支持JavaScript、TypeScript、JSX和TSX格式化</p>
            </div>
            <div className={`${styles.feature} ${styles.featureGreen}`}>
              <h3 className={styles.featureTitle}>实时预览</h3>
              <p className={styles.featureDescription}>即时查看格式化结果</p>
            </div>
            <div className={`${styles.feature} ${styles.featurePurple}`}>
              <h3 className={styles.featureTitle}>一键复制</h3>
              <p className={styles.featureDescription}>格式化完成后可直接复制代码</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeFormatter;
