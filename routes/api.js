const PREFIX = require("../libs/const").PREFIX;
const router = require('koa-router')();
const fs = require('fs');
var tool = require("../libs/tool");
router.prefix(PREFIX);

router.get('/', function (ctx, next) {
    ctx.response.type = 'json';
    ctx.response.body = {data: 'Hello World'};
})
// *匹配以api为首的接口
router.all('/*', function (ctx, next) {
    ctx.response.type = 'json';
    var req = ctx.request;
    var method = req.method || "GET";
    console.log(req.path);
    var filePath = tool.getFilePathNoProject(req.path, req.method);
    // console.log("filePath in routes api.js==>>" + filePath);
    var read = new Promise(function (resolve, reject) {
        resolve(fs.readFileSync(filePath))
    });

    read.then(function (response) {
        response = JSON.parse(response);
        ctx.response.body = response ? response.response : {};
    }).catch(function (response) {
        ctx.response.body = {
            results: "Path does not exist /(ㄒoㄒ)/~~"
        };
    })
})
module.exports = router
