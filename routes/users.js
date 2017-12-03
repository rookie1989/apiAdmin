const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
    ctx.response.type = 'json';
    ctx.response.body = {data: 'Hello World'};
})

module.exports = router
