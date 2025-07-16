# likeMe - 一个可爱的互动点赞组件

> 🍰 快速为你的网站添加 "你喜欢我吗 / Do you like me" 小组件

---

## 功能特性

- 🎨 **可自定义颜色** - 支持自定义主题色彩
- 💾 **数据持久化** - 使用LeanCloud存储点赞数据
- 🚀 **快速部署** - 一键部署到Vercel
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔒 **防重复点赞** - 基于IP地址防止重复点赞
- ⚡ **高性能** - 轻量级，加载速度快

---

## 快速开始

### 1. LeanCloud 设置

1. [登录](https://console.leancloud.app/login) 或 [注册](https://console.leancloud.app/register) `LeanCloud 国际版` 并进入 [控制台](https://console.leancloud.app/apps)。
2. 点击左上角 [创建应用](https://console.leancloud.app/apps) 并起一个你喜欢的名字（请选择免费的 **开发版**）。
3. 进入应用，选择左下角的 **设置 > 应用凭证**，你可以看到你的 **APP ID**、**APP Key** 和 **REST API 服务器地址**，请记录它们以备后续使用。

### 2. 创建数据表

进入应用，选择左上角的 **数据存储 > 结构化数据**，依次创建以下两个 Class：

#### 创建 likeCount 表
- **Class 名称**：`likeCount`
- **Class 访问权限**：除 `update` 和 `find` 外均选择 **指定用户**
- **默认 ACL 权限**：选定为 **限制读取**，然后点击 **创建**

#### 创建 likeUser 表
- **Class 名称**：`likeUser`
- **Class 访问权限**：除 `create` 和 `find` 外均选择 **指定用户**
- **默认 ACL 权限**：选定为 **限制读取**，然后点击 **创建**

### 3. 初始化数据

1. 选择新建的 `likeCount` Class，点击 **添加行**
2. 添加一个名为 `count` 的 **Number** 字段，设置值为 `0`
3. 将 **ACL 权限** 设置为 **所有用户**，点击 **添加**
4. 记录生成行的 `objectId`

此时你应该拥有以下信息：
- `APP ID`
- `APP Key`
- `REST API 服务器地址`
- `objectId` 🎉

---

## 部署到 Vercel

### 方法一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/5ime/likeMe)

1. 点击上方按钮跳转至 **Vercel** 进行部署
2. 输入一个你喜欢的 Vercel 项目名称并点击 **Create**
3. 等待部署完成
4. 点击 **Go to Dashboard** 跳转到控制台

### 方法二：手动部署

1. Fork 或 Clone 本项目到你的 GitHub
2. 在 Vercel 中导入你的项目
3. 配置构建设置（通常会自动检测）

### 配置环境变量

进入 **Settings > Environment Variables** 配置以下环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `appId` | LeanCloud 的 APP ID | `your-app-id` |
| `appKey` | LeanCloud 的 APP Key | `your-app-key` |
| `serverURL` | LeanCloud 的 REST API 服务器地址 | `https://your-app.lc-cn-n1-shared.com` |
| `objectId` | likeCount 表中记录的 objectId | `your-object-id` |

### 重新部署

环境变量配置完成后，进入 **Deployments**，找到最新一次部署并点击 **Redeploy** 按钮以使环境变量生效。

部署完成后，点击 **Visit** 跳转到部署好的地址，此地址即为你的服务端地址。

---

## 本地开发

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件（或在系统环境变量中设置）：

```bash
appId=your-leancloud-app-id
appKey=your-leancloud-app-key
serverURL=your-leancloud-server-url
objectId=your-object-id
PORT=3000
```

### 启动开发服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

---

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
        serverURL: 'https://your-domain.vercel.app', // 替换为你的服务端地址
        color: '#ff9797' // 可选：自定义主题颜色
    });
</script>
```

### 方法二：下载使用

1. 下载 `static/css/likeme.css` 和 `static/js/likeme.js`
2. 在你的项目中引入这些文件
3. 按照上面的方式初始化组件

### 配置选项

```javascript
likeMe({
    el: '#likeme',                    // 必需：容器选择器
    serverURL: 'https://your-domain.vercel.app',  // 必需：服务端地址
    color: '#ff9797'                  // 可选：主题颜色，默认为 #ff9797
});
```

---

## 自定义域名（可选）

1. 进入 `Vercel` 控制台的 **Settings > Domains**
2. 输入需要绑定的域名并点击 **Add**
3. 在域名服务商处添加 `CNAME` 记录：
   - **Type**: `CNAME`
   - **Name**: `your-subdomain`
   - **Value**: `cname.vercel-dns.com`
4. 等待 `DNS` 生效后，即可通过自定义域名访问 🎉

---

## API 接口

### 获取点赞数

```
GET /info
```

返回：
```json
{
    "code": "200",
    "data": {
        "count": 42
    },
    "msg": "success"
}
```

### 提交点赞

```
GET /like
```

返回：
```json
{
    "code": "200",
    "data": {
        "count": 43
    },
    "msg": "success"
}
```

