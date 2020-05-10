'use strict';


const process = require('process');
const { format } = require('util');
const _ = require('underscore');


const { File, TraceId } = require('../util');
const { DEFAULT_OPTION, DEPAULT_PLACE_HOLDER } = require('../common/constant/logger');
const { Winston, getGlobalWinstonInstance } = require('./winston');
const traceIdInstance = new TraceId();


const globalWinstonInstance = getGlobalWinstonInstance();


class BaseLogger {

  constructor(options = DEFAULT_OPTION) {

    this.options = _.clone(options);
    this.context = {};
    const loggerCtx = this.context;

    loggerCtx.startTimestamp = Date.now();

    this.setTraceId();

    // config
    if (options.datePattern !== undefined) {
      loggerCtx.datePattern = options.datePattern;
    } else {
      loggerCtx.datePattern = '-YYYY.MM.DD';
    }

    if (options.hasOwnProperty('isDatePrefix') && options.isDatePrefix === true) { // 前置日期
      loggerCtx.isDatePrefix = options.isDatePrefix;
    } else {
      loggerCtx.isDatePrefix = false;
    }

    if (options.hasOwnProperty('name')) {
      loggerCtx.name = options.name;
    } else {
      loggerCtx.name = DEFAULT_OPTION.name;
    }

    loggerCtx.dir = options.dir ? options.dir : DEFAULT_OPTION.dir;
    loggerCtx.filename = options.filename ? options.filename : DEFAULT_OPTION.filename;
    loggerCtx.console = options.console ? options.console : DEFAULT_OPTION.console;
    loggerCtx.level = options.level ? options.level : DEFAULT_OPTION.level;
    loggerCtx.needErrorFile = options.needErrorFile ? options.needErrorFile : DEFAULT_OPTION.needErrorFile;
    loggerCtx.closeFile = options.closeFile ? options.closeFile : DEFAULT_OPTION.closeFile;

    loggerCtx.pid = process.pid;
    loggerCtx.api = options.api || DEPAULT_PLACE_HOLDER;
    loggerCtx.method = options.method || DEPAULT_PLACE_HOLDER;
    loggerCtx.timeCost = DEPAULT_PLACE_HOLDER;

    // 创建loggerCtx.dir, 需要权限
    File.checkAndMkdirSync(loggerCtx.dir)
      .then(() => {});

    if (globalWinstonInstance[loggerCtx.name] === undefined) {
      const winston = new Winston(loggerCtx);
      globalWinstonInstance[loggerCtx.name] = winston.getInstance(loggerCtx.name);
    }
  }


  setTraceId() {

    if (typeof arguments[0] === 'string') {
      const traceId = arguments[0];

      this.context.traceId = traceId;
    } else {

      let traceId;
      if (this.options.autoTraceId === true) { // todo: 逻辑需要确认
        traceId = traceIdInstance.generate();
      } else {
        traceId = DEPAULT_PLACE_HOLDER;
      }

      this.context.traceId = traceId;
    }
  }


  getTraceId() {
    return this.context.traceId;
  }


  buildPrefix() {
    this.prefixStr =
      `${this.context.traceId}` + ' ' +
      `${this.context.pid}` + ' ' +
      `${this.context.api}` + ' ' +
      `${this.context.timeCost}`;
  }


  /*
  getModule() {
    return this.context.module;
  }

  setModule(module) {
    this.context.module = module;
    return this;
  }

  setFunc(func) {
    this.context.func = func;
    return this;
  }

  getFunc() {
    return this.context.func;
  }
   */

  /*
  setTraceId(traceId) {
    this.context.traceId = traceId;
    return this;
  }
   */


  info(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].info(curLog);
  }

  debug(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].debug(curLog);
  }

  error(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].error(curLog);
  }

  warn(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].warn(curLog);
  }

  trace(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].trace(curLog);
  }

  fatal(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].fatal(curLog);
  }
}


module.exports = BaseLogger;
