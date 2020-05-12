'use strict';


const { Net } = require('./util');
const { BaseLogger } = require('./logger');
// const { defaultOption } = require('./option');
const { constant } = require('./common');
const { DEFAULT_OPTION } = constant.LOGGER;
const { TRACE_ID_HEADER } = constant.TRACE_ID;


function middleware(option = {}) {

  async function buildKoa2LoggerHandler(ctx, next) {

    let loggerName;
    if (option.name === undefined) {
      loggerName = 'logger';
    } else {
      loggerName = option.name;
    }

    const uri = Net.Http.getUri(ctx.method, ctx.url);

    const httpOption = {
      api: uri,
      method: ctx.method
    };

    // headers x-trace-id 优先级高于配置
    if (ctx.req.headers[ TRACE_ID_HEADER ]) {
      httpOption.traceId = ctx.req.headers[ TRACE_ID_HEADER ];
    }

    const loggerOption = Object.assign(httpOption, DEFAULT_OPTION, option);

    const loggerInstance = new BaseLogger(loggerOption);
    if (!loggerInstance) {
      throw new Error('new loggerInstance error');
    }

    ctx[ loggerName ] = loggerInstance;

    await next();
  }

  return buildKoa2LoggerHandler;
}


module.exports = middleware;
