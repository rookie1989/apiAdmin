const router = require('koa-router')();
const fs = require('fs');
const tool = require('../libs/tool');

router.get('/', async (ctx, next) => {
    // console.log(ctx);
    var jsonName = './resource/jsonList.json';
    var haveList = false;
    var list = [];
    var read = fs.readFileSync(jsonName);
    var list = JSON.parse(read).dataList ? JSON.parse(read).dataList : [];

    await ctx.render('index', {
        title: "API Admin",
        list: list
    })
});

router.post('/editApi', async (ctx, next) => {
    let body = ctx.request.body;
    let title = body.title;
    let description = body.description;
    let path = body.path;
    let orginalPath = body.orginalPath;
    let method = body.method.toLowerCase();
    let orginalMethod = body.orginalMethod.toLowerCase();
    let code = body.code;

    var jsonName = tool.getFilePath(path, method);
    var jsonName_0 = tool.getFilePath(orginalPath, orginalMethod);

    if (path != orginalPath || method != orginalMethod) {
        fs.rename(jsonName_0, jsonName, function (err) {
            if (err) {
                throw err;
            }
            console.log('done!');
        })
    }

    // 拼装json内容start
    let jsonObj = new Object();
    jsonObj['title'] = title;
    jsonObj['description'] = description;
    jsonObj['method'] = method.toUpperCase();
    jsonObj['path'] = path;
    jsonObj['response'] = JSON.parse(code);
    // 格式化jsonObj是为了保持json文件的可读性
    var jsonString = JSON.stringify(jsonObj, null, 4);
    // 拼装json内容end
    ctx.response.type = 'json';
    if (path) {
        var read = new Promise(function (resolve, reject) {
            resolve(fs.writeFileSync(jsonName, jsonString))
        });
        //更新新的数据到关系表
        tool.updateName({
            title: title,
            description: description,
            orginalPath: orginalPath,
            path: path,
            method: method,
        });
        read.then(function (response) {
            ctx.response.body = {
                success: true,
                message: "保存成功"
            };
        }).catch(function (response) {
            ctx.response.body = {
                success: false,
                message: "保存失败"
            };
        })
    } else {
        ctx.response.body = {
            success: false,
            message: "缺失参数"
        };
    }
});

router.post('/addApi', async (ctx, next) => {
    console.log("add api ============");
    console.log(ctx.request.body);
    let body = ctx.request.body;
    let title = body.title;
    let description = body.description;
    let path = body.path;
    let method = body.method.toLowerCase();
    let code = body.code;

    let jsonName = tool.getFilePath(path, method);
    // 拼装json内容start
    let jsonObj = new Object();
    jsonObj['title'] = title;
    jsonObj['description'] = description;
    jsonObj['method'] = method.toUpperCase();
    jsonObj['path'] = path;
    jsonObj['response'] = JSON.parse(code);
    // 格式化jsonObj是为了保持json文件的可读性
    var jsonString = JSON.stringify(jsonObj, null, 4);
    // 拼装json内容end
    ctx.response.type = 'json';
    if (title && path) {
        var read = new Promise(function (resolve, reject) {
            resolve(fs.writeFileSync(jsonName, jsonString))
        });
        //保存关系表
        tool.saveName({
            title: title,
            description: description,
            path: path,
            method: method,
        });
        read.then(function (response) {
            ctx.response.body = {
                success: true,
                message: "保存成功"
            };
        }).catch(function (response) {
            ctx.response.body = {
                success: false,
                message: response
            };
        })
    } else {
        //后台加一道拦截，防止没有文件名和url
        res.json({success: false, message: "名称或url不能为空"})
    }
});

router.post('/deleteApi', async (ctx, next) => {
    console.log("delete api ============");
    console.log(ctx.request.body);
    let body = ctx.request.body;
    let title = body.title;
    let description = body.description;
    let path = body.path;
    let method = body.method.toLowerCase();
    let jsonName = tool.getFilePath(path, method);

    if (title && path) {
        let del = new Promise(function (resolve, reject) {
            resolve(fs.unlinkSync(jsonName))
        });
        tool.saveName({
            title: title,
            description: description,
            path: path,
            method: method,
            del: true
        });
        del.then(function (response) {
            ctx.response.body = {
                success: true,
                message: "删除成功"
            };
        }).catch(function (e) {
            ctx.response.body = {
                success: false,
                message: "删除失败"
            };
        })
    }
})

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json',
    }
});

module.exports = router
