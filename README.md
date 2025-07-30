# 架构
Monorepo 模式
- Next.js
- Nest.js ~~+ Rspack~~
- Turbo 做整合

# Why？
## Why only Next.js？
因为 Next.js 支持 Turbopack，速度够快，配置也够，所以 Next.js 不需要 Rspack。
## ~~Why Rspack？~~
~~其实 Nest.js 可以直接用 tsc 编译，但是想要扩展的话，还是需要一个专业打包工具，所以引用了 Rspack。另外现在谁家好人还在用 Webpack（bushi）~~

我错了，现在 Rspack 对 Nest.js 支持也是一坨，还是回归 tsc 了
