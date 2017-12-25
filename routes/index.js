const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const tool = require('../libs/tool');
const filter = require('../libs/filter');
router.get('/', async (ctx, next) => {
    let user = {
        email: "97174746@qq.com",
        password: "12345",
    };
    if (!filter.checkLogin(ctx)) {
        await ctx.redirect('/login');
        return;
    }

    var jsonName = './resource/jsonList.json';
    var haveList = false;
    var list = [];
    var read = fs.readFileSync(jsonName);
    var list = JSON.parse(read).dataList ? JSON.parse(read).dataList : [];
    var module = [];
    var projectList = [];
    var pmObj = new Object();
    list.sort(function (a, b) {
        var aUrlSortVal = a.url.split("/")[1];
        var bUrlSortVal = b.url.split("/")[1];
        return aUrlSortVal[0] > bUrlSortVal[0];
    });
    list.map((item, index) => {
        let urlStr = item.url.substr(1);
        let urlStr2 = urlStr.split("/")[0];
        let projectStr = item.project;


        if (!pmObj[projectStr]) {
            pmObj[projectStr] = new Array();
        }
        if (pmObj[projectStr].indexOf(urlStr2) < 0) {
            pmObj[projectStr].push(urlStr2);
        }

        if (module.indexOf(urlStr2) < 0) {
            module.push(urlStr2);
        }
        if (projectList.indexOf(projectStr) < 0) {
            projectList.push(projectStr);
        }
        item["module"] = urlStr2;
    });

    // ctx.response.body = {
    //     success: true,
    //     list: list,
    //     module: module,
    //     projectList: projectList,
    //     pmObj: pmObj
    // };
    await ctx.render('index', {
        title: "API Admin",
        list: list,
        module: module,
        projectList: projectList,
        pmObj: pmObj
    })
});

router.get('/login', async (ctx, next) => {
    if (filter.checkLogin(ctx)) {
        await ctx.redirect('/');
    } else {
        await ctx.render('login')
    }
});
router.post('/user/login', async (ctx, next) => {
    let body = ctx.request.body;
    let userName = body.userName;
    let password = body.password;
    if (filter.login(userName, password)) {
        // 成功登录
        ctx.cookies.set('__mock_admin_filter_character', userName + "_" + password);
        // ctx.cookies.set("Max-Age=120000")
        ctx.response.body = {
            success: true,
            message: "登录成功"
        };
    } else {
        ctx.response.body = {
            success: false,
            message: "登录失败"
        };
    }
});
router.post('/editApi', async (ctx, next) => {
    let body = ctx.request.body;
    let title = body.title;
    let project = body.project;
    let orginalProject = body.orginalProject;
    let url = body.url;
    let orginalUrl = body.orginalUrl;
    let method = body.method.toLowerCase();
    let orginalMethod = body.orginalMethod.toLowerCase();
    let code = body.code;

    var jsonName = tool.getFilePath(project, url, method);
    var jsonName_0 = tool.getFilePath(orginalProject, orginalUrl, orginalMethod);
    // 说明修改前和修改后在同一个文件夹
    if (url != orginalUrl || method != orginalMethod) {
        fs.rename(jsonName_0, jsonName, function (err) {
            if (err) {
                ctx.response.body = {
                    success: false,
                    message: "操作失败！"
                };
                throw err;
                return;
            } else {
                // console.log('修改api重命名文件成功');
            }
        })
    }


    // 拼装json内容start
    let jsonObj = new Object();
    jsonObj['title'] = title;
    jsonObj['project'] = project;
    jsonObj['method'] = method.toUpperCase();
    jsonObj['url'] = url;
    jsonObj['response'] = JSON.parse(code);
    // 格式化jsonObj是为了保持json文件的可读性
    var jsonString = JSON.stringify(jsonObj, null, 4);
    // 拼装json内容end
    // console.log(jsonString);
    ctx.response.type = 'json';
    if (url) {
        var read = new Promise(function (resolve, reject) {
            resolve(fs.writeFileSync(jsonName, jsonString))
        });
        //更新新的数据到关系表
        tool.updateName({
            title: title,
            project: project,
            orginalUrl: orginalUrl,
            url: url,
            method: method,
            orginalMethod: orginalMethod.toUpperCase()
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
    // console.log("add api ============");
    // console.log(ctx.request.body);
    // return;
    let body = ctx.request.body;
    let title = body.title;
    let project = body.project;
    let url = body.url;
    let method = body.method.toLowerCase();
    let code = body.code;

    let jsonName = tool.getFilePath(project, url, method);
    // 拼装json内容start
    let jsonObj = new Object();
    jsonObj['title'] = title;
    jsonObj['project'] = project;
    jsonObj['method'] = method.toUpperCase();
    jsonObj['url'] = url;
    jsonObj['response'] = JSON.parse(code);
    // 格式化jsonObj是为了保持json文件的可读性
    var jsonString = JSON.stringify(jsonObj, null, 4);
    // 拼装json内容end
    ctx.response.type = 'json';
    if (title && url) {
        var read = new Promise(function (resolve, reject) {
            resolve(fs.writeFileSync(jsonName, jsonString))
        });
        //保存关系表
        tool.saveName({
            title: title,
            project: project,
            url: url,
            method: method.toUpperCase(),
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
    let body = ctx.request.body;
    let title = body.title;
    let project = body.project;
    let url = body.url;
    let method = body.method.toLowerCase();
    let jsonName = tool.getFilePath(project, url, method);

    if (title && url) {
        let del = new Promise(function (resolve, reject) {
            resolve(fs.unlinkSync(jsonName))
        });
        tool.saveName({
            title: title,
            project: project,
            url: url,
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

// router.get('/rebuild', async (ctx, next) => {
//     console.log("fine=====================");
//     ctx.body = {
//         title: 'api not work now,maybe later',
//     }
// });

module.exports = router
