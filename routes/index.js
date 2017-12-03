const router = require('koa-router')();
const fs = require('fs');

router.get('/', async (ctx, next) => {
    var jsonName = './resource/jsonList.json';
    var haveList=false;
    var list=[];
    var read = fs.readFileSync(jsonName);
    var list=JSON.parse(read).dataList?JSON.parse(read).dataList:[];

    await ctx.render('index', {
        title:"index title",
        list:list
    })
})

router.get('/editApi', async (ctx, next) => {
    console.log(ctx);
    // 写一个方法来解析body
    ctx.response.type = 'json';
    ctx.response.body = {
        data: 'Hello World'
    };
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json',
  }
});

module.exports = router
