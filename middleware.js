'use strict';


// const { Url } = require('../util');
const { Net } = require('./util');
const { BaseLogger } = require('./logger');
const { defaultOption } = require('./option');


const TRACEID_HEADER = 'x-trace-id'; // http headers

// function middleware(Logger, option = {}) {
function middleware(option = {}) {

  async function buildKoa2LoggerHandler(ctx, next) {

    let loggerName;
    if (option.name === undefined) {
      loggerName = 'logger';
    } else {
      loggerName = option.name;
    }

    const uri = Net.Http.getUri(ctx.method, ctx.url);

    const httpOptions = {
      api: uri,
      method: ctx.method
    };

    if (ctx.req.headers[ TRACEID_HEADER ]) {
      httpOptions.traceId = ctx.req.headers[ TRACEID_HEADER ];
    }

    // const curOptions = Object.assign(httpOptions, DefaultOption, option);
    const curOptions = Object.assign(httpOptions, defaultOption, option);

    // const baseNodeLoggerInstance = new Logger(curOptions);
    const baseNodeLoggerInstance = new BaseLogger(curOptions);
    if (!baseNodeLoggerInstance) {
      throw new Error('new baseNodeLoggerInstance error');
    }

    // set to ctx
    ctx[loggerName] = baseNodeLoggerInstance;

    await next();
  }

  return buildKoa2LoggerHandler;
}


module.exports = middleware;
