# likeMe

> 🍰快速为你的网站添加 你喜欢我吗/Do you like me 小组件

## LeanCloud 设置

1. [登录](https://console.leancloud.app/login) 或 [注册](https://console.leancloud.app/register) `LeanCloud 国际版` 并进入 [控制台](https://console.leancloud.app/apps)
2. 点击左上角 [创建应用](https://console.leancloud.app/apps) 并起一个你喜欢的名字 (请选择免费的**开发版**):
3. 进入应用，选择左下角的 `设置` > `应用凭证`。你可以看到你的 `APP ID`,`APP Key` 和 `REST API 服务器地址`。请记录它们，以便后续使用。
4. 进入应用，选择左上角的 `数据存储` > `结构化数据` > `创建 Class`。`Class 名称` 填写为 `likeCount`，`Class 访问权限` 除 `update` 和 `find` 外均选择 `指定用户`，`默认 ACL 权限` 选定为 `限制读取`，点击 `创建` 。
5. 选择新建的 `Class` 然后 `添加行` -> `设置 ACL 权限` 均设置为 `所有用户` ，点击 `添加` ，你可以看到新建行的 `objectId,`。请记录它，以便后续使用。
6. 再次`创建 Class`，`Class 名称` 填写为 `likeUser`，`Class 访问权限`  除 `create` 和 `find` 外均选择 `指定用户`，`默认 ACL 权限` 选定为 `限制读取`，点击 `创建` 。

此时你应该拥有了以下信息：`APP ID`,`APP Key`,`REST API 服务器地址` 和 `objectId`:tada:

## Vercel部署

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/5ime/likeme)

1. 点击上方按钮，跳转至 `Vercel` 进行部署。

2. 输入一个你喜欢的 `Vercel` 项目名称并点击 `Create` 继续:

3. 此时 `Vercel` 会基于 `likeMe` 模板帮助你新建并初始化仓库，仓库名为你之前输入的项目名。

    一两分钟后，满屏的烟花会庆祝你部署成功。此时点击 `Go to Dashboard` 可以跳转到应用的控制台。

4. 点击顶部的 `Settings` - `Environment Variables` 进入环境变量配置页，并配置四个环境变量 `appId`, `appKey` , `serverURL` 和 `objectId` 。它们的值分别对应上一步在 `LeanCloud` 中获得的 `APP ID`, `APP KEY`,`REST API 服务器地址` 和 `objectId`。

1. 环境变量配置完成之后点击顶部的 `Deployments` 点击顶部最新的一次部署右侧的 `Redeploy` 按钮进行重新部署。该步骤是为了让刚才设置的环境变量生效。

1. 此时会跳转到 `Overview` 界面开始部署，等待片刻后 `STATUS` 会变成 `Ready`。此时请点击 `Visit` ，即可跳转到部署好的网站地址，此地址即为你的服务端地址。

## 绑定域名 (可选)

1. 点击顶部的 `Settings` - `Domains` 进入域名配置页

1. 输入需要绑定的域名并点击 `Add`

1. 在域名服务器商处添加新的 `CNAME` 解析记录

   | Type  | Name    | Value                |
   | ----- | ------- | -------------------- |
   | CNAME | example | cname.vercel-dns.com |

1. 等待生效，你可以通过自己的域名来访问了:tada:

## HTML 引入

在你的网页中进行如下设置:

1. 使用 `CDN` 引入 `likeMe`:

   - `https://unpkg.com/@5ime/likeme@latest/static/css/likeme.css`。
   - `https://unpkg.com/@5ime/likeme@latest/static/js/likeme.js`。

2. 创建 `<script>` 标签使用 `new limeMe()` 初始化，并传入必要的 `el` 与 `serverURL` 选项。

   - `el` 选项是 `likeMe` 渲染使用的元素，你可以设置一个字符串形式的  `CSS 选择器` 或者一个 `HTMLElement` 对象。
   - `serverURL` 是服务端的地址，即上一步获取到的值。
   - `color` 是卡片的背景颜色 (可选)。

   ```html {3-7,12-18}:line-numbers
   <head>
    <!-- ... -->
     <link rel="stylesheet" href='https://unpkg.com/@5ime/likeme@latest/static/css/likeme.css'/>
     <script src="https://unpkg.com/@5ime/likeme@latest/static/js/likeme.js"></script>
    <!-- ... -->
   </head>
   <body>
    <!-- ... -->
     <div id="likeme"></div>
     <script>
        new limeMe({
            el: '#likeme',
            serverURL: 'https://your-domain.vercel.app',
        });
     </script>
   </body>
   ```

2. 此时 `likeMe` 就会在你的网站上成功运行 :tada:

