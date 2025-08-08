import React, { useCallback, useRef, useState } from 'react';
import CodeEditor, { FormatError, ICodeEditorRef } from '@pages/_components/CodeEditor';
import styles from './styles.module.scss';

// 简单的HTML压缩函数
const simpleMinify = (html: string): string => {
  // 移除HTML注释
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // 移除多余的空白字符，但保留标签间的空格
  html = html.replace(/>\s+</g, '><');

  // 移除开头和结尾的空白字符
  html = html.trim();

  return html;
};

// 使用eval方式加密HTML
const encryptWithEval = (html: string): string => {
  // 转义HTML中的引号和换行符
  const escapedHtml = html
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');

  // 生成eval加密代码
  return `<script>
(function() {
  var html = "${escapedHtml}";
  document.open();
  document.write(html);
  document.close();
})();
</script>`;
};

const HtmlFormatter: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const compressCodeHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const minified = simpleMinify(inputCode);
      setInputCode(minified)
    } catch (err) {
      setError('压缩失败: ' + (err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputCode]);

  const encryptAndCompressHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // 先压缩
      const minified = simpleMinify(inputCode);

      // 再用eval方式加密
      const encrypted = encryptWithEval(minified);

      setInputCode(encrypted)
    } catch (err) {
      setError('加密压缩失败: ' + (err as Error).message);
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
          <h1 className={styles.title}>HTML代码格式化</h1>
          <p className={styles.description}>快速格式化您的HTML代码，使其更易读和维护</p>
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

            <CodeEditor
              ref={editorRef}
              value={inputCode}
              language="html"
              onChange={setInputCode}
              onFormatError={handleFormatError}
              showFormat={false} // 我们使用自己的格式化按钮
              editorStyle={{ maxHeight: 400 }}
            />
          </div>

          {/* 操作按钮 */}
          <div className={styles.buttonContainer}>
            <button
              onClick={formatCodeHandler}
              disabled={isLoading || !inputCode.trim()}
              className={`${styles.actionButton} ${
                isLoading || !inputCode.trim() ? styles.disabled : styles.enabled
              }`}
            >
              {isLoading ? '格式化中...' : '格式化代码'}
            </button>

            <button
              onClick={compressCodeHandler}
              disabled={isLoading || !inputCode.trim()}
              className={`${styles.actionButton} ${
                isLoading || !inputCode.trim() ? styles.disabled : styles.enabled
              }`}
            >
              {isLoading ? '压缩中...' : '压缩代码'}
            </button>

            <button
              onClick={encryptAndCompressHandler}
              disabled={isLoading || !inputCode.trim()}
              className={`${styles.actionButton} ${
                isLoading || !inputCode.trim() ? styles.disabled : styles.enabled
              }`}
            >
              {isLoading ? '加密压缩中...' : '加密压缩'}
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
          <h2 className={styles.featuresTitle}>关于HTML代码格式化工具</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.feature} ${styles.featureBlue}`}>
              <h3 className={styles.featureTitle}>标准格式化</h3>
              <p className={styles.featureDescription}>使用标准规则格式化HTML代码，提高代码可读性</p>
            </div>
            <div className={`${styles.feature} ${styles.featureGreen}`}>
              <h3 className={styles.featureTitle}>实时预览</h3>
              <p className={styles.featureDescription}>即时查看格式化结果</p>
            </div>
            <div className={`${styles.feature} ${styles.featurePurple}`}>
              <h3 className={styles.featureTitle}>一键复制</h3>
              <p className={styles.featureDescription}>格式化完成后可直接复制代码</p>
            </div>
            <div className={`${styles.feature} ${styles.featureOrange}`}>
              <h3 className={styles.featureTitle}>代码压缩</h3>
              <p className={styles.featureDescription}>去除多余空格和注释，减小文件体积</p>
            </div>
            <div className={`${styles.feature} ${styles.featureRed}`}>
              <h3 className={styles.featureTitle}>加密压缩</h3>
              <p className={styles.featureDescription}>使用eval方式加密，保护代码不被轻易查看</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlFormatter;
