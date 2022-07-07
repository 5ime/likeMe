const express = require('express')
const AV = require('leancloud-storage');
const { Query, User } = AV;
const app = express()
const port = 80

AV.init({
    appId: process.env.appId,
    appKey: process.env.appKey,
    serverURL: process.env.serverURL
});

const query = new AV.Query('likeCount');
const account = AV.Object.createWithoutData('likeCount', process.env.objectId);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function getState(req,res){
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/info', (req,res) => {
    query.find().then(function (results) {
        const data = {code: '200', msg: 'success', data: {count: results[0].attributes.count}}
        res.send(data);
    }
    ).catch(function (error) {
        const data = {code: '201', msg: 'error'}
        res.send(data);
    });
})

app.get('/like', (req, res) => {
    account.increment('count', +1);
    account.save(null, {
        query: new AV.Query('likeCount').greaterThanOrEqualTo('count', +1),fetchWhenSave: true
    }).then((account) => {
        const data = {code: '200', msg: 'success', data: {count: account.attributes.count}}
        res.send(data);
    }, (error) => {
        if (error.code === 305) {
            const data = {code: '201', msg: 'error'}
            res.send(data);
        }
    });
})

app.listen(port, () => {})
