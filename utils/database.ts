import { DataSource } from 'typeorm';
import path from 'path';

// 数据库配置
const databaseConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'code-pulse',
  synchronize: process.env.NODE_ENV !== 'production', // 在生产环境中应设置为false
  logging: process.env.NODE_ENV === 'development',
  entities: [
    path.join(__dirname, '../entities/*.{ts,js}'),
  ],
  migrations: [
    path.join(__dirname, '../migrations/*.{ts,js}'),
  ],
  subscribers: [
    path.join(__dirname, '../subscribers/*.{ts,js}'),
  ],
};

// 创建DataSource实例
export const AppDataSource = new DataSource(databaseConfig);

// 初始化数据库连接
export const initDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
};
