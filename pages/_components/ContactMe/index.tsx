import { Tooltip } from "antd";
import { Github, Mail, Wechat } from "@icon-park/react";
import Image from "next/image";
import WeChatQRCode from "../../../public/WeChat.png";
import { memo } from "react";
import styles from "./styles.module.scss";

const ContactMe = () => {
  return (
    <div>
      <h2>联系我</h2>
      <div className={styles.channel}>
        {/* 微信二维码 */}
        <div className={styles['channel-item']}>
          <Tooltip
            color="#FFFFFF"
            title={
              <Image
                alt="wechat"
                src={WeChatQRCode}
                height="408"
                width="300"
              />
            }
          >
            <Wechat className={styles.icon} theme="outline" size="36" fill="#000" />
          </Tooltip>
        </div>
        {/* GitHub */}
        <div className={styles['channel-item']}>
          <a
            href="https://github.com/xiaoyaochengjushi"
            target="_blank"
          >
            <Github className={styles.icon} theme="outline" size="36" fill="#000" />
          </a>
        </div>
        {/* Email */}
        <div className={styles['channel-item']}>
          <a
            href="mailto:liuchengxu1994@gmail.com"
            target="_blank"
          >
            <Mail className={styles.icon} theme="outline" size="36" fill="#000000" />
          </a>
        </div>
      </div>
    </div>
  )
};

export default memo(ContactMe)
