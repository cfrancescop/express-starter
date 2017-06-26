"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./logging");
const config_1 = require("./config");
const pg = require("pg");
const mysql = require("mysql");
class Pool {
    constructor() {
    }
}
exports.Pool = Pool;
exports.pool = new Pool();
if (config_1.config.mysql != null) {
    const mysqlPool = mysql.createPool(config_1.config.mysql);
    exports.pool.length = (result) => result.length;
    exports.pool.get = (result, index) => result[index];
    exports.pool.query = function (text, values) {
        logging_1.log.info({ query: text, values: values });
        return new Promise((resolve, reject) => {
            mysqlPool.query(text, values, (err, result, fields) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
}
else if (config_1.config.postgres != null) {
    const pgPool = new pg.Pool(config_1.config.postgres);
    pgPool.on('error', function (err, client) {
        logging_1.log.warn({ err: err, client: client }, "PG ERROR");
    });
    exports.pool.length = (result) => result.rowCount;
    exports.pool.get = (result, index) => result.rows[index];
    exports.pool.query = function (text, values) {
        logging_1.log.info({ query: text, values: values });
        return new Promise((resolve, reject) => {
            pgPool.query(text, values, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    };
}
else {
    exports.pool.query = function (text, values) {
        logging_1.log.error("NO DATASOURCE DEFINED");
        return new Promise((resolve, reject) => {
            reject({ error: "NO DATASOURCE DEFINED" });
        });
    };
}
