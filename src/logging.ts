export const bunyan = require('bunyan');
import {config} from './config';
export const log = bunyan.createLogger(config.buyan);
