"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./logging");
const config_1 = require("./config");
class UsernamePassword {
}
exports.UsernamePassword = UsernamePassword;
class NoEncode {
    matches(input, encoded) {
        return input === encoded;
    }
    encode(input) {
        return input;
    }
}
exports.NoEncode = NoEncode;
class AuthenticationManager {
    constructor(pool, encder) {
        this.pool = pool;
        this.encoder = encder;
    }
    authenticate(auth) {
        const pool = this.pool;
        const encoder = this.encoder;
        const query = config_1.config.authentication.query;
        return new Promise((res, err) => {
            if (auth == null || auth.username == null) {
                err({ error: 'Invalid Username/Password' });
            }
            logging_1.log.info({ q: query, param: auth.username }, "Query for username");
            pool.query(query, [auth.username], (error, results, fields) => {
                logging_1.log.info("Query completed");
                if (error)
                    err(error);
                if (results.length != 1) {
                    logging_1.log.info("NO RESULT");
                    err({ error: 'Invalid Username/Password' });
                    return;
                }
                let result = results[0];
                if (encoder.matches(auth.password, result.password)) {
                    res(result.username);
                }
                else {
                    logging_1.log.info("NO MATCH");
                    err({ msg: 'Invalid Username/Password' });
                }
            });
        });
    }
}
exports.AuthenticationManager = AuthenticationManager;
