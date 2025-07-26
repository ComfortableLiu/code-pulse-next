import { RunScriptWebpackPlugin } from "run-script-webpack-plugin";
import { rspack } from "@rspack/core";
import type { Configuration } from "@rspack/core"
import { fileURLToPath } from "node:url";
import path from "path";

// 由于在 ES 模块中没有 __dirname，所以我们需要创建它
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(path.dirname(__filename)));
const __backend_dirname = path.dirname(__filename);

// 获取当前环境
// const env = process.env.NODE_ENV || 'development';

// 确定环境文件路径
// const envPath = path.resolve(path.dirname(__filename), `config/env/.env.${env}`);

// 获取当前环境
// const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  context: __dirname,
  target: 'node',
  entry: {
    main: [path.resolve(__backend_dirname, `./src/index.ts`)],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    modules: [
      'node_modules',
      path.resolve(__dirname, '../..', 'node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                decorators: true,
              },
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
              },
            },
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          // We need to disable mangling and compression for class names and function names for Nest.js to work properly
          // The execution context class returns a reference to the class/handler function, which is for example used for applying metadata using decorators
          // https://docs.nestjs.com/fundamentals/execution-context#executioncontext-class
          compress: {
            keep_classnames: true,
            keep_fnames: true,
          },
          mangle: {
            keep_classnames: true,
            keep_fnames: true,
          },
        },
      }),
    ],
  },
  externalsType: 'commonjs',
  plugins: [
    !process.env.BUILD &&
    new RunScriptWebpackPlugin({
      name: 'main.js',
      autoRestart: false,
    }),
  ].filter(Boolean),
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
  externals: [
    function (obj, callback) {
      const resource = obj.request || '';
      const lazyImports = [
        '@nestjs/core',
        '@nestjs/common',
        '@nestjs/microservices',
        '@nestjs/platform-express',
        'typeorm',
        'cache-manager',
        'class-validator',
        'class-transformer',
        // ADD THIS
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets',
        'socket.io-adapter',
        'utf-8-validate',
        'bufferutil',
        'kerberos',
        '@mongodb-js/zstd',
        'snappy',
        '@aws-sdk/credential-providers',
        'mongodb-client-encryption',
        '@nestjs/websockets/socket-module',
        'bson-ext',
        'snappy/package.json',
        'aws4',
        'app-root-path',
      ];
      if (!lazyImports.includes(resource)) {
        return callback();
      }
      try {
        require.resolve(resource);
      } catch (err) {
        callback(err as Error, resource);
      }
      callback();
    },
  ],
};

export default config
