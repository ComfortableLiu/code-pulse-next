import React, { Fragment, useCallback, useMemo, useState } from "react";
import { Button, message, Space, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CryptoJS from "crypto-js";
import styles from "./styles.module.scss";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const FileHash = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [hashResults, setHashResults] = useState<Record<string, Record<string, string>>>({});
  const [calculating, setCalculating] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  // 支持的哈希算法列表
  const algorithms = useMemo(() => [
    "MD5",
    "SHA-1",
    "SHA-256",
    "SHA-384",
    "SHA-512"
  ], []);

  // 处理文件上传
  const handleFileUpload = useCallback((file: File) => {
    // 检查文件是否已存在
    if (fileList.some(f => f.name === file.name && f.size === file.size)) {
      messageApi.warning("文件已存在");
      return false;
    }

    setFileList(prev => [...prev, file]);
    return false; // 阻止自动上传
  }, [fileList, messageApi]);

  // 批量处理文件（用于拖拽上传）
  const handleFilesUpload = useCallback((files: FileList) => {
    const newFiles: File[] = [];
    let duplicateCount = 0;

    Array.from(files).forEach(file => {
      // 检查文件是否已存在
      if (fileList.some(f => f.name === file.name && f.size === file.size)) {
        duplicateCount++;
      } else {
        newFiles.push(file);
      }
    });

    if (duplicateCount > 0) {
      messageApi.warning(`有 ${duplicateCount} 个文件已存在`);
    }

    if (newFiles.length > 0) {
      setFileList(prev => [...prev, ...newFiles]);
    }

    return false; // 阻止自动上传
  }, [fileList, messageApi]);

  // 移除文件
  const handleRemoveFile = useCallback((fileName: string) => {
    setFileList(prev => prev.filter(file => file.name !== fileName));
    setHashResults(prev => {
      const newResults = { ...prev };
      delete newResults[fileName];
      return newResults;
    });
  }, []);

  // 处理拖拽事件
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesUpload(files);
    }
  }, [handleFilesUpload]);

  // 处理拖拽事件
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // 计算文件哈希值
  const calculateHashes = useCallback(async () => {
    if (fileList.length === 0) {
      messageApi.warning("请先选择文件");
      return;
    }

    setCalculating(true);
    const results: Record<string, Record<string, string>> = {};

    try {
      for (const file of fileList) {
        results[file.name] = {};

        // 读取文件内容
        const arrayBuffer = await file.arrayBuffer();
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

        // 对每个算法计算哈希
        for (const algorithm of algorithms) {
          try {
            let hashHex = "";

            switch (algorithm) {
              case "MD5":
                hashHex = CryptoJS.MD5(wordArray).toString();
                break;
              case "SHA-1":
                hashHex = CryptoJS.SHA1(wordArray).toString();
                break;
              case "SHA-256":
                hashHex = CryptoJS.SHA256(wordArray).toString();
                break;
              case "SHA-384":
                hashHex = CryptoJS.SHA384(wordArray).toString();
                break;
              case "SHA-512":
                hashHex = CryptoJS.SHA512(wordArray).toString();
                break;
              default:
                // 使用Web Crypto API作为后备方案
                const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
            }

            results[file.name][algorithm] = hashHex;
          } catch (error) {
            results[file.name][algorithm] = "计算出错";
            console.error(`计算 ${algorithm} 哈希时出错:`, error);
          }
        }
      }

      setHashResults(results);
      messageApi.success("哈希计算完成");
    } catch (error) {
      messageApi.error("计算哈希时发生错误");
      console.error("计算哈希时发生错误:", error);
    } finally {
      setCalculating(false);
    }
  }, [fileList, messageApi, algorithms]);

  // 复制哈希值到剪贴板
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success("已复制到剪贴板");
    } catch (error) {
      messageApi.error("复制失败");
    }
  }, [messageApi]);

  return (
    <Fragment>
      {contextHolder}
      <div className={styles.container}>
        <Title level={2}>文件哈希计算</Title>
        <Text>选择文件并计算多种哈希算法的值，所有计算均在本地进行，不会上传任何文件。</Text>

        <div className={styles.section}>
          <Title level={4}>上传文件</Title>
          {/* 拖拽上传区域 */}
          <div
            className={styles.dragger}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Dragger
              beforeUpload={handleFileUpload}
              fileList={[]}
              multiple
              showUploadList={false}
              className={styles.uploadDragger}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击选择文件或拖拽文件到此处</p>
              <p className="ant-upload-hint">
                支持多个文件同时上传，所有计算均在本地进行
              </p>
            </Dragger>
          </div>

          {fileList.length > 0 && (
            <div className={styles.fileList}>
              <Title level={5} style={{ marginTop: 16 }}>已选择的文件:</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                {fileList.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <Text strong>{file.name}</Text>
                    <Text type="secondary" style={{ marginLeft: 12 }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </Text>
                    <Button
                      type="link"
                      danger
                      onClick={() => handleRemoveFile(file.name)}
                    >
                      移除
                    </Button>
                  </div>
                ))}
              </Space>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <Title level={4}>计算哈希</Title>
          <Button
            type="primary"
            onClick={calculateHashes}
            loading={calculating}
            disabled={fileList.length === 0}
          >
            计算所有文件的哈希值
          </Button>

          {Object.keys(hashResults).length > 0 && (
            <div className={styles.results}>
              <Title level={4} style={{ marginTop: 24 }}>计算结果</Title>
              {Object.entries(hashResults).map(([fileName, hashes]) => (
                <div
                  key={fileName}
                  className={styles.resultCard}
                >
                  <Title level={5} className={styles.resultTitle}>{fileName}</Title>
                  <div className={styles.resultContent}>
                    {Object.entries(hashes).map(([algorithm, hash]) => (
                      <div key={algorithm} className={styles.hashItem}>
                        <Text strong>{algorithm}:</Text>
                        <div className={styles.hashValueContainer}>
                          <Text className={styles.hashValue}>{hash}</Text>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => copyToClipboard(hash)}
                          >
                            复制
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default FileHash;
