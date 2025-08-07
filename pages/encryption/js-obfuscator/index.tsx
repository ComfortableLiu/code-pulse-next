import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { Button, Card, Col, Input, InputNumber, message, Row, Slider, Switch, Typography } from "antd";
import type { SliderMarks } from 'antd/es/slider';
import CodeEditor, { ICodeEditorRef } from "@pages/_components/CodeEditor";
import styles from "./styles.module.scss";
import { ObfuscatorOptions } from "javascript-obfuscator";

const { Title, Text, Paragraph } = Typography;

const JsObfuscator = () => {
  // 原始代码
  const [originalCode, setOriginalCode] = useState<string>('// 输入你的JavaScript代码\nfunction example() {\n  const message = "Hello World";\n  console.log(message);\n  return message;\n}\n\nexample();');
  // 混淆后代码
  const [obfuscatedCode, setObfuscatedCode] = useState<string>('');
  // 混淆选项
  const [options, setOptions] = useState<ObfuscatorOptions>({
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    identifiersDictionary: [],
    identifiersPrefix: '',
    numbersToExpressions: false,
    renameGlobals: false,
    renameProperties: false,
    renamePropertiesMode: 'safe',
    simplify: true,
    splitStrings: false,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: false,
    unicodeEscapeSequence: false
  });

  const [messageApi, contextHolder] = message.useMessage();

  const obfuscatedCodeEditorRef = useRef<ICodeEditorRef>(null);

  // 更新选项
  const updateOption = useCallback(<K extends keyof ObfuscatorOptions>(key: K, value: ObfuscatorOptions[K]) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // 混淆函数
  const obfuscate = useCallback(async () => {
    if (!originalCode) {
      messageApi.warning('请输入代码');
      return;
    }

    try {
      // 动态导入javascript-obfuscator以避免服务端渲染问题
      const { obfuscate: obfuscateFunction } = await import('javascript-obfuscator');

      const obfuscationResult = obfuscateFunction(originalCode, options);
      setObfuscatedCode(obfuscationResult.getObfuscatedCode());
    } catch (error) {
      console.error('混淆出错:', error);
      messageApi.error(`混淆失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [originalCode, options, messageApi]);

  // 交换原文和结果
  const swapTexts = useCallback(() => {
    const temp = originalCode;
    setOriginalCode(obfuscatedCode);
    setObfuscatedCode(temp);
  }, [obfuscatedCode, originalCode]);

  // 操作按钮组
  const operationButtons = useMemo(() => (
    <div className={styles['btn-group']}>
      <Button
        type="primary"
        onClick={obfuscate}
        size="large"
      >
        混淆代码
      </Button>
      <Button
        onClick={swapTexts}
        size="large"
      >
        交换文本
      </Button>
    </div>
  ), [obfuscate, swapTexts]);

  // 标记
  const thresholdMarks: SliderMarks = {
    0: '0%',
    0.25: '25%',
    0.5: '50%',
    0.75: '75%',
    1: '100%'
  };

  return (
    <Fragment>
      {contextHolder}
      <Title level={2}>JavaScript 代码混淆工具</Title>
      <Paragraph>
        使用强大的 <Text code>javascript-obfuscator</Text> 库对 JavaScript 代码进行混淆，保护您的源代码。
      </Paragraph>

      <div className={styles['operation-container']}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div className={styles['section']}>
              <div className={styles['section-title']}>
                原始代码
              </div>
              <CodeEditor
                value={originalCode}
                language="javascript"
                onChange={setOriginalCode}
                editorStyle={{ maxHeight: 400 }}
              />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className={styles['section']}>
              <div className={styles['section-title']}>
                混淆结果
              </div>
              <CodeEditor
                ref={obfuscatedCodeEditorRef}
                value={obfuscatedCode}
                language="javascript"
                onChange={setObfuscatedCode}
                editorStyle={{ maxHeight: 400 }}
              />
            </div>
          </Col>
        </Row>

        {operationButtons}

        <Card title="混淆选项" size="small" className={styles['options-section']}>
          <Row gutter={[16, 16]}>
            {/* 基本选项 */}
            <Col xs={24} md={12} lg={8}>
              <Card size="small" title="基本选项" className={styles['option-group']}>
                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    紧凑输出
                    <Text type="secondary" className={styles['option-description']}>
                      删除代码中的换行符和缩进
                    </Text>
                  </div>
                  <Switch
                    checked={options.compact}
                    onChange={(value) => updateOption('compact', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    简化代码
                    <Text type="secondary" className={styles['option-description']}>
                      优化代码结构，简化布尔表达式
                    </Text>
                  </div>
                  <Switch
                    checked={options.simplify}
                    onChange={(value) => updateOption('simplify', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    转换对象键
                    <Text type="secondary" className={styles['option-description']}>
                      转换对象键和属性
                    </Text>
                  </div>
                  <Switch
                    checked={options.transformObjectKeys}
                    onChange={(value) => updateOption('transformObjectKeys', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    Unicode 转义
                    <Text type="secondary" className={styles['option-description']}>
                      启用 Unicode 转义序列
                    </Text>
                  </div>
                  <Switch
                    checked={options.unicodeEscapeSequence}
                    onChange={(value) => updateOption('unicodeEscapeSequence', value)}
                  />
                </div>
              </Card>
            </Col>

            {/* 控制流选项 */}
            <Col xs={24} md={12} lg={8}>
              <Card size="small" title="控制流保护" className={styles['option-group']}>
                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    控制流扁平化
                    <Text type="secondary" className={styles['option-description']}>
                      扁平化控制流结构以增加代码复杂度
                    </Text>
                  </div>
                  <Switch
                    checked={options.controlFlowFlattening}
                    onChange={(value) => updateOption('controlFlowFlattening', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    扁平化阈值
                    <Text type="secondary" className={styles['option-description']}>
                    </Text>
                  </div>
                  <Slider
                    styles={{
                      root: {
                        width: 150,
                        margin: '0 24px'
                      }
                    }}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={thresholdMarks}
                    value={options.controlFlowFlatteningThreshold}
                    onChange={(value) => updateOption('controlFlowFlatteningThreshold', value)}
                    disabled={!options.controlFlowFlattening}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    数字转表达式
                    <Text type="secondary" className={styles['option-description']}>
                      将数字转换为表达式
                    </Text>
                  </div>
                  <Switch
                    checked={options.numbersToExpressions}
                    onChange={(value) => updateOption('numbersToExpressions', value)}
                  />
                </div>
              </Card>
            </Col>

            {/* 字符串选项 */}
            <Col xs={24} md={12} lg={8}>
              <Card size="small" title="字符串保护" className={styles['option-group']}>
                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    字符串数组
                    <Text type="secondary" className={styles['option-description']}>
                      将字符串放入特殊数组中
                    </Text>
                  </div>
                  <Switch
                    checked={options.stringArray}
                    onChange={(value) => updateOption('stringArray', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    字符串数组阈值
                    <Text type="secondary" className={styles['option-description']}>
                    </Text>
                  </div>
                  <Slider
                    styles={{
                      root: {
                        width: 150,
                        margin: '0 24px'
                      }
                    }}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={thresholdMarks}
                    value={options.stringArrayThreshold}
                    onChange={(value) => updateOption('stringArrayThreshold', value)}
                    disabled={!options.stringArray}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    分割字符串
                    <Text type="secondary" className={styles['option-description']}>
                      将字符串分割成多个块
                    </Text>
                  </div>
                  <Switch
                    checked={options.splitStrings}
                    onChange={(value) => updateOption('splitStrings', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    分割长度
                    <Text type="secondary" className={styles['option-description']}>
                    </Text>
                  </div>
                  <InputNumber
                    min={1}
                    max={20}
                    value={options.splitStringsChunkLength}
                    onChange={(value) => value && updateOption('splitStringsChunkLength', value)}
                    disabled={!options.splitStrings}
                  />
                </div>
              </Card>
            </Col>

            {/* 调试保护选项 */}
            <Col xs={24} md={12} lg={8}>
              <Card size="small" title="调试保护" className={styles['option-group']}>
                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    调试保护
                    <Text type="secondary" className={styles['option-description']}>
                      检测并阻止调试器使用
                    </Text>
                  </div>
                  <Switch
                    checked={options.debugProtection}
                    onChange={(value) => updateOption('debugProtection', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    调试保护间隔
                    <Text type="secondary" className={styles['option-description']}>
                      定期间隔检测调试器（毫秒）
                    </Text>
                  </div>
                  <InputNumber
                    min={0}
                    value={options.debugProtectionInterval}
                    onChange={(value) => updateOption('debugProtectionInterval', value || 0)}
                    disabled={!options.debugProtection}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    禁用控制台输出
                    <Text type="secondary" className={styles['option-description']}>
                      禁用 console.log 等输出
                    </Text>
                  </div>
                  <Switch
                    checked={options.disableConsoleOutput}
                    onChange={(value) => updateOption('disableConsoleOutput', value)}
                  />
                </div>
              </Card>
            </Col>

            {/* 标识符选项 */}
            <Col xs={24} md={12} lg={8}>
              <Card size="small" title="标识符处理" className={styles['option-group']}>
                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    标识符生成器
                    <Text type="secondary" className={styles['option-description']}>
                      变量和函数名混淆方式
                    </Text>
                  </div>
                  <select
                    value={options.identifierNamesGenerator}
                    onChange={(e) => updateOption('identifierNamesGenerator', e.target.value as never)}
                    className={styles['option-select']}
                  >
                    <option value="hexadecimal">十六进制</option>
                    <option value="mangled">简短标识符</option>
                    <option value="mangled-shuffled">随机简短标识符</option>
                    <option value="randomized">随机标识符</option>
                    <option value="randomized-hexadecimal">随机十六进制</option>
                    <option value="dictionary">字典模式</option>
                  </select>
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    标识符前缀
                    <Text type="secondary" className={styles['option-description']}>
                      全局标识符前缀
                    </Text>
                  </div>
                  <Input
                    styles={{
                      input: {
                        width: 150
                      }
                    }}
                    value={options.identifiersPrefix}
                    onChange={(e) => updateOption('identifiersPrefix', e.target.value)}
                    placeholder="例如: _0x"
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    重命名全局变量
                    <Text type="secondary" className={styles['option-description']}>
                      重命名全局声明的标识符
                    </Text>
                  </div>
                  <Switch
                    checked={options.renameGlobals}
                    onChange={(value) => updateOption('renameGlobals', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    重命名属性
                    <Text type="secondary" className={styles['option-description']}>
                      重命名对象属性
                    </Text>
                  </div>
                  <Switch
                    checked={options.renameProperties}
                    onChange={(value) => updateOption('renameProperties', value)}
                  />
                </div>
              </Card>
            </Col>

            {/* 死代码选项 */}
            <Col xs={24} md={12} lg={8}>
              <Card size="small" title="死代码注入" className={styles['option-group']}>
                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    死代码注入
                    <Text type="secondary" className={styles['option-description']}>
                      注入不会执行的代码片段
                    </Text>
                  </div>
                  <Switch
                    checked={options.deadCodeInjection}
                    onChange={(value) => updateOption('deadCodeInjection', value)}
                  />
                </div>

                <div className={styles['option-item']}>
                  <div className={styles['option-label']}>
                    死代码阈值
                    <Text type="secondary" className={styles['option-description']}>
                    </Text>
                  </div>
                  <Slider
                    styles={{
                      root: {
                        width: 150,
                        margin: '0 24px'
                      }
                    }}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={thresholdMarks}
                    value={options.deadCodeInjectionThreshold}
                    onChange={(value) => updateOption('deadCodeInjectionThreshold', value)}
                    disabled={!options.deadCodeInjection}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card title="使用说明" size="small">
          <Title level={4}>功能介绍</Title>
          <Paragraph>
            JavaScript Obfuscator 是一个功能强大的 JavaScript 混淆工具，它通过各种代码转换技术来保护您的源代码。
            混淆后的代码虽然功能不变，但难以阅读和理解，从而保护您的知识产权。
          </Paragraph>

          <Title level={4}>主要特性</Title>
          <ul className={styles['feature-list']}>
            <li><Text strong>变量重命名:</Text> 将变量和函数名替换为无意义的标识符</li>
            <li><Text strong>字符串数组:</Text> 将字符串放入数组中，增加阅读难度</li>
            <li><Text strong>控制流扁平化:</Text> 扁平化代码结构，使逻辑难以追踪</li>
            <li><Text strong>死代码注入:</Text> 插入永远不会执行的代码片段</li>
            <li><Text strong>调试保护:</Text> 检测并阻止调试器使用</li>
            <li><Text strong>代码压缩:</Text> 删除不必要的空格和换行符</li>
          </ul>

          <Title level={4}>注意事项</Title>
          <ul className={styles['warning-list']}>
            <li>混淆会显著增加代码体积并降低执行性能（15-80%，取决于配置）</li>
            <li>混淆仅提供代码保护，并非绝对安全</li>
            <li>不要混淆第三方库或框架代码</li>
            <li>混淆后的代码难以调试，请在开发阶段保留原始代码</li>
          </ul>
        </Card>
      </div>
    </Fragment>
  );
};

export default JsObfuscator;
