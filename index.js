const express = require('express');
const AV = require('leancloud-storage');

const app = express();
const port = process.env.PORT || 80;

AV.init({
    appId: process.env.appId,
    appKey: process.env.appKey,
    serverURL: process.env.serverURL
});

const OBJECT_ID = process.env.objectId;
const account = AV.Object.createWithoutData('likeCount', process.env.objectId);

async function getCurrentCount() {
    try {
        const result = await new AV.Query('likeCount').get(OBJECT_ID);
        return result.get('count') || 0;
    } catch (error) {
        try {
            const results = await new AV.Query('likeCount').find();
            const record = results.find(r => r.id === OBJECT_ID) || results[0];
            return record?.get('count') || 0;
        } catch (fallbackError) {
            const firstResult = await new AV.Query('likeCount').first();
            return firstResult?.get('count') || 0;
        }
    }
}

async function checkUserExists(ip) {
    try {
        return await new AV.Query('likeUser').equalTo('ip', ip).first();
    } catch (error) {
        if (error.code === 101) return false;
        throw error;
    }
}

async function saveUserRecord(ip) {
    try {
        const likeUser = new (AV.Object.extend('likeUser'))();
        likeUser.set('ip', ip);
        await likeUser.save();
    } catch (error) {
        console.warn('Error: ', error.message);
    }
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

app.use('/static', express.static(`${__dirname}/static`));
app.use('/demo', express.static(`${__dirname}/demo`));
app.get('/', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.get('/info', async (req, res) => {
    try {
        const count = await getCurrentCount();
        res.json({ code: '200', msg: 'success', data: { count } });
    } catch (error) {
        console.error('Error in /info:', error);
        res.json({ code: '201', msg: '哎呀，数据偷懒跑掉了' });
    }
});

app.get('/like', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    try {
        const userExists = await checkUserExists(ip);
        if (userExists) {
            return res.json({ code: '201', msg: '今天的爱意已经收到啦~' });
        }

        const currentCount = await getCurrentCount();
        const newCount = currentCount + 1;
        
        account.set('count', newCount);
        await account.save();

        await saveUserRecord(ip);

        res.json({ 
            code: '200', 
            msg: 'success', 
            data: { count: newCount } 
        });
    } catch (error) {
        console.error('Error in /like:', error);
        res.json({ code: '201', msg: '你的爱意传递失败~' });
    }
});

app.listen(port, () => {
    console.log(`💖 启动成功！端口：${port}`);
    console.log(`✨ 运行环境：${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 访问地址：http://localhost:${port}`);
});