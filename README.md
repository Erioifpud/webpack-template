# Webpack 模版

# 使用方式
1. 通过全局或项目中的`eslint --init`根据需要生成格式化配置。
2. 调整 webpack.js。
3. 安装需要的开发依赖。
4. 根据以上设置调整 .babelrc 或 jsconfig.json。
5. 如果项目用于开发 package，那么记得在 package.json 中补全`main`、`keywords`、`unpkg`、`jsdelivr`、`repository`等字段。
6. 如果是 Typescript 项目，则需要将 jsconfig.json 调整为 tsconfig.json，并且补全`types`字段。
7. 需要提交 git 的话，记得使用`git remote remove origin`删除原来的远程仓库。
8. 需要提交 npm 的话，根据情况调整 .npmignore，忽略部分与库无关的文件。
9. 如果打包的是网页，那么需要根据打包后的资源路径调整`publicPath`。

# tsconfig 模版
compilerOptions.paths 参考现有的 jsconfig.json，合并处理。
```json
{
  "include": ["src/**/*"],
  "compilerOptions": {
    "module": "commonjs",
    "sourceMap": true,
    "target": "es5",
    "declaration": true,
    "declarationDir": "./@types",
    "lib": [
      "es5",
      "dom",
      "es2015.promise"
    ]
  }
}
```