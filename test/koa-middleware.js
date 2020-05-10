'use strict';


const Koa = require('koa');
const app = new Koa();

const middleware = require('../middleware');
const defaultOptions = require('../option');


app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  ctx.logger.info('test logger 1.');
  ctx.logger.error('test logger 2.');
});

app.use(middleware(defaultOptions));

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});


app.use(async ctx => {
  ctx.body = 'Hello World';
});


app.listen(3000);
