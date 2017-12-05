const router = require('koa-router')();
const fs = require('fs');
const prefix = '/api';
var tool=require("../libs/tool");
router.prefix(prefix)

router.get('/', function (ctx, next) {
    ctx.response.type = 'json';
    ctx.response.body = {data: 'Hello World'};
})
// *匹配以api为首的接口
router.all('/*', function (ctx, next) {
    ctx.response.type = 'json';
    // console.log("=======================");
    // console.log(ctx);
    var req = ctx.request;
    var method = req.method;
    var filePath=tool.getFilePath(req.url,req.method);

    var read = new Promise(function (resolve, reject) {
        resolve(fs.readFileSync(filePath))
    });

    read.then(function (response) {
        response = JSON.parse(response);
        ctx.response.body = response ? response : {};
    }).catch(function (response) {
        ctx.response.body = {
            results: "Path does not exist /(ㄒoㄒ)/~~"
        };
    })
})
module.exports = router
