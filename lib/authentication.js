"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./logging");
const config_1 = require("./config");
const datasource_1 = require("./datasource");
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
    constructor() {
        if (config_1.config.authentication.encoder == null || config_1.config.authentication.encoder === 'NoEncode') {
            this.encoder = new NoEncode();
        }
    }
    authenticate(auth) {
        const encoder = this.encoder;
        const queryAuth = config_1.config.authentication.query;
        return new Promise((res, err) => {
            if (auth == null || auth.username == null) {
                err({ error: 'Invalid Username/Password' });
            }
            logging_1.log.info({ q: queryAuth, param: auth.username }, "Query for username");
            datasource_1.pool.query(queryAuth, [auth.username]).then(results => {
                logging_1.log.info("Query completed");
                if (results == null) {
                    err({ error: 'Internal Server Error' });
                    return;
                }
                console.log(results);
                if (datasource_1.pool.length(results) != 1) {
                    logging_1.log.info("NO RESULT");
                    err({ error: 'Invalid Username/Password' });
                    return;
                }
                let result = datasource_1.pool.get(results, 0);
                if (encoder.matches(auth.password, result.password)) {
                    res(result.username);
                }
                else {
                    logging_1.log.info("NO MATCH");
                    err({ msg: 'Invalid Username/Password' });
                }
            }).catch(error => {
                logging_1.log.warn(error);
                err(error);
            });
        });
    }
}
exports.AuthenticationManager = AuthenticationManager;
