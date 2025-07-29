import { ChangeEvent, Fragment, memo, useMemo, useState } from "react";
import { Button, Flex, Form, Input, InputNumber, Radio, Switch } from "antd";
import { DownPicture } from "@icon-park/react";
import styles from "./styles.module.scss";
import { QRCodeCanvas } from "qrcode.react";
import { isUndefined } from "@utils/index";

const { TextArea } = Input

type Level = 'L' | 'M' | 'Q' | 'H'

const QRCode = () => {


  // 状态管理
  const [content, setContent] = useState<string>('https://example.com');
  const [size, setSize] = useState(300);

  const [level, setLevel] = useState<Level>('M')
  const [background, setBackground] = useState('#ffffff')
  const [foreground, setForeground] = useState('#000000')
  const [margin, setMargin] = useState(1)

  // 是否开启logo设置
  const [showImageSettings, setShowImageSettings] = useState<boolean>(false)

  // 可传入二维码图片相关的属性，支持二维码 LOGO；
  const [imageSettings, setImageSettings] = useState<{
    src: string;
    height: number;
    width: number;
    excavate: boolean;
    x?: number;
    y?: number;
    opacity?: number;
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
  }>({
    src: '',
    height: 100,
    width: 100,
    excavate: true
  })
  // logo居中对齐
  const imageCenter = useMemo<boolean>(() => isUndefined(imageSettings.x) && isUndefined(imageSettings.y), [imageSettings.x, imageSettings.y])

  // 下载二维码
  const downloadQrCode = () => {
    if (document) {
      const qrcode = document.querySelector('canvas')
      if (!qrcode) return
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = qrcode.toDataURL('image/png');
      link.click();
    }
  }

  return (
    <Fragment>
      <h1>二维码生成</h1>
      <div className={styles.workspace}>
        <Form className="form">
          <Form.Item
            label="内容"
            rules={[{ required: true }]}
          >
            <TextArea
              value={content}
              onChange={(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setContent(value.target.value)}
              rows={3}
              placeholder="输入要编码的文本、URL等..."
            />
          </Form.Item>

          <Form.Item
            label="尺寸"
            rules={[{ required: true }]}
          >
            <InputNumber
              disabled
              value={size}
              min={100}
              max={1000}
            />
          </Form.Item>

          <Form.Item
            label="颜色"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center'
              }}
            >
              <Input
                value={foreground}
                onChange={(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForeground(value.target.value)}
                style={{ width: 150 }}
              />
              <Input
                type="color"
                value={foreground}
                onChange={(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForeground(value.target.value)}
                style={{ width: 80 }}
              />
            </div>
          </Form.Item>

          <div className="more-form">
            <Form.Item
              label="边缘空白"
            >
              <InputNumber
                value={margin}
                onChange={value => setMargin(value || 0)}
              />
            </Form.Item>

            <div className="hr-start">
              <div className="line" />
              高级设置
              <div className="line" />
            </div>

            <div className="advanced-settings">
              <Form.Item
                help={(
                  <span>
                    QR码具有“纠错功能”。即使编码变脏或破损，也可自动恢复数据。调高级别，纠错能力也相应提高，但编码尺寸也也会变大。
                    <a href="https://www.qrcode.com/zh/about/error_correction.html" target="_blank">查看详情</a>
                  </span>
                )}
                label="容错等级"
              >
                <Radio.Group
                  value={level}
                  onChange={value => setLevel(value.target.value)}
                >
                  <Radio.Button value="L">L</Radio.Button>
                  <Radio.Button value="M">M</Radio.Button>
                  <Radio.Button value="Q">Q</Radio.Button>
                  <Radio.Button value="H">H</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="背景颜色" help="普通二维码白色部分的颜色">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center'
                  }}
                >
                  <Input
                    value={background}
                    onChange={(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBackground(value.target.value)}
                    style={{ width: 150 }}
                  />
                  <Input
                    type="color"
                    value={background}
                    onChange={(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBackground(value.target.value)}
                    style={{ width: 80 }}
                  />
                </div>
              </Form.Item>

              <Form.Item label="logo设置">
                <Switch
                  checked={showImageSettings}
                  onChange={(checked: boolean) => setShowImageSettings(checked)}
                />
              </Form.Item>

              <Form.Item
                label="图片地址"
                style={{ display: showImageSettings ? 'block' : 'none' }}
                rules={[{ required: showImageSettings }]}
              >
                <Input
                  type="url"
                  value={imageSettings.src}
                  onChange={(value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setImageSettings({
                      ...imageSettings,
                      src: value.target.value
                    })
                  }}
                />
              </Form.Item>

              <Form.Item
                label="logo偏移量"
                style={{ display: showImageSettings ? 'block' : 'none' }}
              >
                <Flex gap="middle">
                  <Flex align="center">
                    中心对齐：
                    <Switch
                      checked={imageCenter}
                      onChange={(checked: boolean) => {
                        setImageSettings({
                          ...imageSettings,
                          x: checked ? undefined : 0,
                          y: checked ? undefined : 0
                        })
                      }}
                    />
                  </Flex>
                  <Flex align="center" gap="small">
                    X:
                    <InputNumber
                      disabled={imageCenter}
                      value={imageSettings.x}
                      onChange={value => {
                        setImageSettings({
                          ...imageSettings,
                          x: value || 0
                        })
                      }}
                    />
                    Y:
                    <InputNumber
                      disabled={imageCenter}
                      value={imageSettings.y}
                      onChange={value => {
                        setImageSettings({
                          ...imageSettings,
                          y: value || 0
                        })
                      }}
                    />
                  </Flex>
                </Flex>
              </Form.Item>

              <Form.Item
                label="logo宽度"
                style={{ display: showImageSettings ? 'block' : 'none' }}
                rules={[{ required: showImageSettings }]}
              >
                <InputNumber
                  value={imageSettings.width}
                  onChange={value => {
                    setImageSettings({
                      ...imageSettings,
                      width: value || 0
                    })
                  }}
                />
              </Form.Item>

              <Form.Item
                label="logo高度"
                style={{ display: showImageSettings ? 'block' : 'none' }}
                rules={[{ required: showImageSettings }]}
              >
                <InputNumber
                  type="number"
                  value={imageSettings.height}
                  onChange={value => {
                    setImageSettings({
                      ...imageSettings,
                      height: value || 0
                    })
                  }}
                />
              </Form.Item>

              <Form.Item
                label="是否“挖掘”图像周围的模块"
                help="这意味着嵌入图像重叠的任何模块都将使用背景颜色。使用此选项可确保图像周围的边缘清晰。嵌入透明图像时也很有用。"
                style={{ display: showImageSettings ? 'block' : 'none' }}
              >
                <Switch
                  checked={imageSettings.excavate}
                  onChange={(checked: boolean) => {
                    setImageSettings({
                      ...imageSettings,
                      excavate: checked
                    })
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
        <div className="vertical-divider" />
        <div className="qrcode-preview">
          <h2>二维码预览</h2>
          {content ?
            <Fragment>
              <div className="qrcode-canvas">
                <QRCodeCanvas
                  boostLevel
                  title={"标题"}
                  value={content}
                  size={300}
                  marginSize={margin}
                  level={level}
                  bgColor={background}
                  fgColor={foreground}
                  imageSettings={showImageSettings ? imageSettings : undefined}
                  minVersion={1}
                />
              </div>
              <div>
                <Button
                  onClick={downloadQrCode}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <DownPicture theme="outline" size="16" fill="#333" />
                  下载二维码
                </Button>
              </div>
            </Fragment>
            : null}
        </div>
      </div>
    </Fragment>
  )
}

export default memo(QRCode)
