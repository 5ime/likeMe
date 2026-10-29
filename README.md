# likeMe - 一个可爱的互动点赞组件

快速给你的网站加一个「你喜欢我吗 / Do you like me」小组件。服务端可部署在 Vercel，点赞数据存 Vercel Postgres（Neon）。

## 功能特性

- 🎨 简洁可爱的 UI 设计
- 🚀 一键部署到 Vercel
- 💾 数据存储在 Vercel Postgres（Neon）
- 🔒 防刷机制：同一 IP 每天只能点赞一次
- ⚡ 自动缓存优化，减少数据库查询
- 📦 支持 CDN 和本地文件两种使用方式
- 🎯 支持自定义主题颜色

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/5ime/likeMe)

1. 点击上方按钮跳转至 **Vercel** 进行部署
2. 输入一个你喜欢的 Vercel 项目名称并点击 **Create**
3. 等待部署完成
4. 点击 **Go to Dashboard** 跳转到控制台

## 配置数据库

本项目使用 Vercel Postgres（底层是 Neon）。你只需要在 Vercel 给当前项目绑定数据库，并确保环境变量里存在 `POSTGRES_URL`。

### 1. 在 Vercel 创建并绑定数据库

1. 打开你的 Vercel 项目
2. 进入 **Storage**
3. 点击 **Create Database**，选择 **Neon**
4. 选择要绑定到的项目（通常就是当前项目）并创建

### 2. 确认环境变量已注入

创建完成后，Vercel 通常会自动把数据库连接信息注入到项目环境变量中。

- 进入 **Settings > Environment Variables**
- 搜索并确认存在：`POSTGRES_URL`

如果没有自动注入，请手动添加：

1. 进入 **Storage > Postgres 数据库详情页**
2. 找到连接字符串（Connection String），复制 `POSTGRES_URL` 对应的值
3. 回到 **Settings > Environment Variables**，新增变量：
   - **Name**：`POSTGRES_URL`
   - **Value**：你复制的连接字符串
   - **Environments**：勾选 `Production / Preview / Development`
4. 保存后到 **Deployments** 点击 **Redeploy**（或触发一次新的部署），让最新环境变量生效

### 3. 如何验证数据库已可用

最简单的方式：访问一次接口触发建表，然后再看是否能正常返回。

- `GET /healthz`：服务是否存活（返回 `ok`）
- `GET /info`：会读取数据库并返回当前点赞数

如果数据库连不上，你通常会在 Vercel 的 **Logs** 里看到与连接/鉴权相关的报错（例如环境变量缺失、连接串无效等）。

> 本项目会在首次请求时自动建表（`like_count` / `like_user`），无需手动建表。

## 在你的网站中使用

### 方法一：使用 CDN

在你的网页中添加以下代码：

```html
<link rel="stylesheet" href="https://unpkg.com/@5ime/likeme@latest/static/css/likeme.css" />
<script src="https://unpkg.com/@5ime/likeme@latest/static/js/likeme.js"></script>

<div id="likeme"></div>

<script>
    likeMe({
        el: '#likeme',
        serverURL: 'https://your-domain.vercel.app', // 替换为你的服务端地址，结尾勿带 /
        color: '#ff9797' // 可选：自定义主题颜色
    });
</script>
```

也可以用你自己的 Vercel 域名加载静态资源：

```html
<link rel="stylesheet" href="https://your-domain.vercel.app/static/css/likeme.css" />
<script src="https://your-domain.vercel.app/static/js/likeme.js"></script>
```

### 方法二：npm 安装

```bash
npm install @5ime/likeme
```

然后引入：

- `node_modules/@5ime/likeme/static/css/likeme.css`
- `node_modules/@5ime/likeme/static/js/likeme.js`

### 配置选项

```javascript
likeMe({
    el: '#likeme',                                  // 必需：容器选择器
    serverURL: 'https://your-domain.vercel.app',    // 必需：服务端地址，结尾勿带 /
    color: '#ff9797'                                // 可选：主题颜色，默认为 #ff9797
});
```

## 本地开发

环境：Node.js >= 18

```bash
npm install
```

创建 `.env`：

```bash
POSTGRES_URL=postgres://...
PORT=3000
ALLOW_ORIGIN=*
TRUST_PROXY=1
INFO_CACHE_SECONDS=5
LIKE_RATE_LIMIT_WINDOW_MS=60000
LIKE_RATE_LIMIT_MAX=20
```

启动项目：

```bash
npm start
```

- `PORT` 可选，默认 `3000`
- `ALLOW_ORIGIN` 可选，默认 `*`（如需限制跨域可填你的站点域名）
- `TRUST_PROXY` 默认 `1`，用于正确识别客户端 IP。
- `/info` 默认缓存 5 秒；`/like` 默认每 IP 每分钟 20 次。

## API 接口

### `GET /info`

获取当前点赞数。

**响应格式：**

成功：
```json
{
  "code": "200",
  "msg": "success",
  "data": {
    "count": 123
  }
}
```

失败：
```json
{
  "code": "201",
  "msg": "哎呀，数据偷懒跑掉了"
}
```

**缓存：** 响应头包含 `Cache-Control: public, max-age=5`（默认缓存 5 秒）

### `GET /like`

提交一次点赞。同一 IP 每天只能点赞一次。

**响应格式：**

成功（首次点赞）：
```json
{
  "code": "200",
  "msg": "success",
  "data": {
    "count": 124
  }
}
```

失败（今日已点赞）：
```json
{
  "code": "201",
  "msg": "今天的爱意已经收到啦~"
}
```

失败（系统错误）：
```json
{
  "code": "201",
  "msg": "你的爱意传递失败~"
}
```

**限流：** 默认每 IP 每分钟最多 20 次请求

### `GET /healthz`

健康检查接口，用于检测服务是否正常运行。

**响应：** 纯文本 `ok`（HTTP 200）