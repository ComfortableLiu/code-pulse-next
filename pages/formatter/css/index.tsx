import React, { useCallback, useRef, useState } from 'react';
import CodeEditor, { FormatError, ICodeEditorRef } from '@pages/_components/CodeEditor';
import styles from './styles.module.scss';
import { formatCode } from '@utils/format-utils';

// 普通压缩 - 保留选择器换行，移除多余空格和注释
const normalMinify = (css: string): string => {
  // 保存原始换行符位置，用于保留选择器间的换行
  let result = css;
  
  // 移除CSS注释，但保留原有的换行符结构
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 按行分割处理
  const lines = result.split('\n');
  const processedLines = lines.map(line => {
    // 移除行首行尾空格
    let trimmedLine = line.trim();
    
    // 在符号周围保留必要的空格
    trimmedLine = trimmedLine.replace(/\s*([{}:;,])\s*/g, (match, p1) => ` ${p1} `);
    
    // 清理多余的空格
    trimmedLine = trimmedLine.replace(/\s+/g, ' ');
    
    // 清理特殊符号周围的空格
    trimmedLine = trimmedLine.replace(/\s*([{}:;,])\s*/g, '$1');
    
    return trimmedLine;
  }).filter(line => line.length > 0); // 移除空行但保留换行结构
  
  return processedLines.join('\n');
};

// 完全压缩 - 移除所有不必要的字符和换行
const fullMinify = (css: string): string => {
  // 移除CSS注释
  let result = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 移除所有多余空白字符
  result = result.replace(/\s+/g, ' ');
  
  // 移除特殊符号周围的空格
  result = result.replace(/\s*([{}:;,])\s*/g, '$1');
  
  // 移除开头和结尾的空白字符
  result = result.trim();
  
  // 移除所有换行符
  result = result.replace(/\n/g, '');
  
  return result;
};

const CssFormatter: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const editorRef = useRef<ICodeEditorRef>(null);

  const formatCodeHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const formatted = await formatCode(inputCode, 'css');
      setInputCode(formatted);
    } catch (err) {
      setError('格式化失败: ' + (err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputCode]);

  const normalCompressHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const compressed = normalMinify(inputCode);
      setInputCode(compressed);
    } catch (err) {
      setError('普通压缩失败: ' + (err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputCode]);

  const fullCompressHandler = useCallback(async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const compressed = fullMinify(inputCode);
      setInputCode(compressed);
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
          <h1 className={styles.title}>CSS代码格式化</h1>
          <p className={styles.description}>快速格式化您的CSS代码，使其更易读和维护</p>
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
              language="css"
              onChange={setInputCode}
              onFormatError={handleFormatError}
              showFormat={false}
              editorStyle={{ maxHeight: 400 }}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center mt-6 space-x-4 flex-wrap">
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
              onClick={normalCompressHandler}
              disabled={isLoading || !inputCode.trim()}
              className={`${styles.actionButton} ${
                isLoading || !inputCode.trim() ? styles.disabled : styles.enabled
              }`}
            >
              {isLoading ? '压缩中...' : '普通压缩'}
            </button>

            <button
              onClick={fullCompressHandler}
              disabled={isLoading || !inputCode.trim()}
              className={`${styles.actionButton} ${
                isLoading || !inputCode.trim() ? styles.disabled : styles.enabled
              }`}
            >
              {isLoading ? '压缩中...' : '完全压缩'}
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
          <h2 className={styles.featuresTitle}>关于CSS代码格式化工具</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.feature} ${styles.featureBlue}`}>
              <h3 className={styles.featureTitle}>标准格式化</h3>
              <p className={styles.featureDescription}>使用标准规则格式化CSS代码，提高代码可读性</p>
            </div>
            <div className={`${styles.feature} ${styles.featureGreen}`}>
              <h3 className={styles.featureTitle}>普通压缩</h3>
              <p className={styles.featureDescription}>移除多余空格和注释，保留选择器换行，减小文件体积</p>
            </div>
            <div className={`${styles.feature} ${styles.featurePurple}`}>
              <h3 className={styles.featureTitle}>完全压缩</h3>
              <p className={styles.featureDescription}>移除所有空格、换行和注释，最大程度减小文件体积</p>
            </div>
            <div className={`${styles.feature} ${styles.featureOrange}`}>
              <h3 className={styles.featureTitle}>一键复制</h3>
              <p className={styles.featureDescription}>格式化完成后可直接复制代码</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssFormatter;
