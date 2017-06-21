"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bunyan = require('bunyan');
const config_1 = require("./config");
exports.log = exports.bunyan.createLogger(config_1.config.buyan);
