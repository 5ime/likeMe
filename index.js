const { createApp } = require('./src/app');
const { port, isVercel } = require('./src/config');

const app = createApp();

if (isVercel) {
  module.exports = app;
} else {
  app.listen(port, () => {
    console.log(`💖 启动成功！端口：${port}`);
    console.log(`✨ 运行环境：${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 访问地址：http://localhost:${port}`);
  });
}