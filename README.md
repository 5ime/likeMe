# likeMe

> 🍰 快速为你的网站添加 "你喜欢我吗 / Do you like me" 小组件

---

## LeanCloud 设置

1. [登录](https://console.leancloud.app/login) 或 [注册](https://console.leancloud.app/register) `LeanCloud 国际版` 并进入 [控制台](https://console.leancloud.app/apps)。
2. 点击左上角 [创建应用](https://console.leancloud.app/apps) 并起一个你喜欢的名字（请选择免费的 **开发版**）。
3. 进入应用，选择左下角的 **设置 > 应用凭证**，你可以看到你的 **APP ID**、**APP Key** 和 **REST API 服务器地址**，请记录它们以备后续使用。
4. 进入应用，选择左上角的 **数据存储 > 结构化数据 > 创建 Class**：
   - **Class 名称** 填写为 `likeCount`。
   - **Class 访问权限**：除 `update` 和 `find` 外均选择 **指定用户**。
   - **默认 ACL 权限**：选定为 **限制读取**，然后点击 **创建**。
5. 选择新建的 `likeCount` Class，点击 **添加行**，并将 **ACL 权限** 设置为 **所有用户**，点击 **添加**，记录生成行的 `objectId`。
6. 再次 **创建 Class**，**Class 名称** 填写为 `likeUser`：
   - **Class 访问权限**：除 `create` 和 `find` 外均选择 **指定用户**。
   - **默认 ACL 权限**：选定为 **限制读取**，然后点击 **创建**。

此时你应该拥有以下信息：
- `APP ID`
- `APP Key`
- `REST API 服务器地址`
- `objectId` 🎉

---

## Vercel 部署

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/5ime/likeme)

1. 点击上方按钮跳转至 **Vercel** 进行部署。
2. 输入一个你喜欢的 Vercel 项目名称并点击 **Create**。
3. Vercel 会基于 `likeMe` 模板新建并初始化仓库，仓库名为你输入的项目名。一两分钟后，满屏的烟花会庆祝部署成功。
4. 点击 **Go to Dashboard** 跳转到控制台。
5. 进入顶部的 **Settings > Environment Variables** 配置以下环境变量：
   - `appId`：LeanCloud 的 `APP ID`。
   - `appKey`：LeanCloud 的 `APP Key`。
   - `serverURL`：LeanCloud 的 `REST API 服务器地址`。
   - `objectId`：`likeCount` 表中记录的 `objectId`。
6. 环境变量配置完成后，进入顶部的 **Deployments**，找到最新一次部署并点击右侧的 **Redeploy** 按钮以使环境变量生效。
7. 部署完成后，点击 **Visit** 跳转到部署好的地址，此地址即为你的服务端地址。

---

## 绑定域名 (可选)

1. 进入 **Settings > Domains** 配置域名。
2. 输入需要绑定的域名并点击 **Add**。
3. 在域名服务器商处添加新的 `CNAME` 记录：
   - **Type**: `CNAME`
   - **Name**: `example`
   - **Value**: `cname.vercel-dns.com`
4. 等待生效后，即可通过自己的域名访问 🎉。

---

## HTML 引入

在网页中进行如下设置：

1. 使用 `CDN` 引入 `likeMe`：
   ```html
   <link rel="stylesheet" href="https://unpkg.com/@5ime/likeme@latest/static/css/likeme.css" />
   <script src="https://unpkg.com/@5ime/likeme@latest/static/js/likeme.js"></script>
   ```

2. 创建 `<script>` 标签并初始化 `likeMe`：
   ```html
   <div id="likeme"></div>
   <script>
       likeMe({
           el: '#likeme',
           serverURL: 'https://your-domain.vercel.app',
           color: '#ff9797', // 可选：设置背景颜色
       });
   </script>
   ```

3. 此时 `likeMe` 就会在你的网站上成功运行 🎉。