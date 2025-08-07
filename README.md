# 架构
- Next.js 自己同时负责前后端
- Typeorm 负责数据库映射
- MySQL 及其兼容数据库

# 启动
## 测试环境
1. 根目录创建.env.xxx相关文件
2. yarn
3. yarn run dev

## 生产环境
1. 根目录创建.env.xxx相关文件
2. yarn
3. yarn run build
4. yarn run prod

需要注意的是，生产环境打包后，不能直接用产物去运行，需要完整的项目文件执行运行。因为 Next.js 打包时不会将 node_modules 一起打包进产物中。 

# env配置
- DB_HOST=数据库地址
- DB_PORT=数据库端口号，默认3306
- DB_USER=数据库登录用户名
- DB_PASS=数据库登录密码
- DB_NAME=数据库名
- API_SECRET_KEY=api接口验签密钥


# Why？
## Why only Next.js？
因为 Next.js 支持 Turbopack，速度够快，配置也够，所以 Next.js 不需要 Rspack。
