'use strict';


const PWD = process.cwd();


const DEFAULT_LOGGER_NAME = 'logger';
const DEFAULT_LEVEL = 'info';
const DEFAULT_DIR = PWD + '/logs';
const DEFAULT_FILE_NAME= 'app';
const DEFAULT_CONSOLE = false;
const DEFAULT_NEED_ERROR_FILE = false;
const DEFAULT_AUTO_TRACE_ID = false;
const DEFAULT_CLOSE_FILE = false;

// default winston option
const DEFAULT_OPTION = {
  name: DEFAULT_LOGGER_NAME,
  level: DEFAULT_LEVEL,
  dir: DEFAULT_DIR,
  filename: DEFAULT_FILE_NAME,
  console: DEFAULT_CONSOLE,
  needErroFile: DEFAULT_NEED_ERROR_FILE,
  autoTraceId: DEFAULT_AUTO_TRACE_ID,
  closeFile: DEFAULT_CLOSE_FILE,
};


exports.DEFAULT_OPTION = DEFAULT_OPTION;
exports.DEPAULT_PLACE_HOLDER = '-';
