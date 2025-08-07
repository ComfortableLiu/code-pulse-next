import { DataSource } from "typeorm";
import type { DataSourceOptions } from "typeorm";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 数据库配置（可从环境变量读取）
const config: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development", // 开发环境自动同步表结构（生产禁用）
  logging: process.env.NODE_ENV === 'development',

  entities: [
    path.join(__dirname, '../db/entities/*.{ts,js}'),
  ],
  migrations: [
    path.join(__dirname, '../db/migrations/*.{ts,js}'),
  ],
  subscribers: [
    path.join(__dirname, '../db/subscribers/*.{ts,js}'),
  ],
};

// 单例模式：确保全局只有一个数据库连接
export let dataSource: DataSource;

export const getDataSource = async () => {
  if (!dataSource) {
    dataSource = new DataSource(config);
  }
  if (!dataSource.isInitialized) {
    try {
      await dataSource.initialize();
      console.log("数据库连接成功");
    } catch (error) {
      console.error("数据库连接失败:", error);
      throw error; // 连接失败时终止应用
    }
  }
  return dataSource;
};
