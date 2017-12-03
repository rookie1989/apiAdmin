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

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json',

  }
});

module.exports = router
