const express = require('express');
const AV = require('leancloud-storage');

const app = express();
const port = 80;

AV.init({
    appId: process.env.appId,
    appKey: process.env.appKey,
    serverURL: process.env.serverURL
});

const account = AV.Object.createWithoutData('likeCount', process.env.objectId);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

app.use('/static', express.static(`${__dirname}/static`));
app.use('/demo', express.static(`${__dirname}/demo`));
app.get('/', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.get('/info', async (req, res) => {
    try {
        const count = (await new AV.Query('likeCount').first())?.get('count') || 0;
        res.json({ code: '200', msg: 'success', data: { count } });
    } catch {
        console.error('Error in /info:', error);
        res.json({ code: '201', msg: '数据拉取失败~' });
    }
});

app.get('/like', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    try {
        const userExists = await new AV.Query('likeUser').equalTo('ip', ip).first();
        if (userExists) return res.json({ code: '201', msg: '今天的爱意已经收到啦~' });

        await account.fetch();
        account.increment('count');
        const updatedAccount = await account.save();

        const acl = new AV.ACL();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(false);

        const likeUser = new (AV.Object.extend('likeUser'))();
        likeUser.set('ip', ip);
        likeUser.setACL(acl);
        await likeUser.save();

        res.json({ code: '200', msg: 'success', data: { count: updatedAccount.get('count') } });
    } catch (error) {
        console.error('Error in /like:', error);
        res.json({ code: '201', msg: '你的爱意传递失败~' });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));