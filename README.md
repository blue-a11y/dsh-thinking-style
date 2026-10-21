# Thinking 样式 · Thinking Style

还原 DeepSeek Harness 初版 Thinking 样式，恢复字号、蓝色流光与思考行扫光，支持思考区域语言选择。

Restore the original DeepSeek Harness Thinking style: typography, blue shimmer, sweeping highlights, and a choice of thinking language.

## 功能

- 还原初版 Thinking 状态行的字号、行高、蓝色文字与连续流光。
- 还原思考内容的字号、行高与思考行的浅色扫光。
- 思考区域语言可选「跟随 DSH」「English」「中文」，自动保存。
- 保留 DSH 原生耗时展示和计时方式。
- 跟随宿主主题，并支持系统的减少动态效果设置。

语言选项用于思考状态文案和耗时单位，其他聊天文案继续跟随 DSH。

## 安装

支持 DeepSeek Harness `>=0.2.1-rc.2 <0.3.0`，已在桌面版 `0.2.1-rc.2` 验证。

桌面版可在插件页通过 npm 包名安装：

```text
@blue-a11y/dsh-thinking-style
```

使用 CLI 管理的 profile：

```sh
dsh plugin --profile web add @blue-a11y/dsh-thinking-style
```

也可以安装 GitHub 上的指定版本：

```sh
dsh plugin --profile web add github:blue-a11y/dsh-thinking-style#v1.0.1
```

本包直接分发 JavaScript，无需安装时构建。若此前安装过 `@local/dsh-thinking-style` 或 `@local/dsh-think-v1`，请先移除旧的本地插件，避免同时启用两个版本。

## 设置

打开 DSH 的插件页，进入「Thinking 样式」，在「思考区域语言」中选择语言。默认跟随 DSH，选择后自动保存。

禁用插件后恢复 DSH 原有外观。耗时数字由 DSH 原生组件更新。

## 开发

```sh
npm run check
npm test
npm pack
```

`npm pack` 会先执行语法检查与语言配置回归测试。发布包只包含插件入口、客户端、配置 patch、语言资源、图标和说明文件。

## License

[MIT](LICENSE)
