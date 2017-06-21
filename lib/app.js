"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logging_1 = require("./logging");
const app = express();
const http_1 = require("http");
const http = http_1.createServer(app);
const config_1 = require("./config");
const mysql_1 = require("mysql");
const pool = mysql_1.createPool(config_1.config.mysql);
const authentication_1 = require("./authentication");
const socket_1 = require("./socket");
let authenticate = new authentication_1.AuthenticationManager(pool, new authentication_1.NoEncode());
let server = new socket_1.SocketServer(authenticate);
app.get('/', (req, res) => {
    pool.query("select 1", (err, result, fields) => {
        if (err) {
            res.send({ socket: true, api: true, database: false });
        }
        else {
            res.send({ socket: true, api: true, database: true });
        }
    });
});
let io = server.init(http, (io) => {
    logging_1.log.info("INIT SOCKET.IO");
});
io.subscribe(socket => {
    logging_1.log.info({ id: socket.id }, "CLIENT CONNECTED");
    let timeout = setTimeout(() => {
        logging_1.log.warn("TIMEOUT FOR AUTHENTICATION");
        socket.disconnect();
    }, 5000);
    server.loginPhase(socket).then(username => {
        clearTimeout(timeout);
        logging_1.log.info({ user: username, id: socket.id }, "Authentication success");
        socket.emit("login", username);
        socket.on('echo', (msg) => {
            logging_1.log.info(msg, "Echo message");
            socket.emit('echo', msg);
        });
        server.disconnectPhase(socket).then(() => {
            logging_1.log.info({ user: username, id: socket.id }, "Disconneted");
        }).catch(err => logging_1.log.info(err));
    }).catch(err => {
        logging_1.log.info({ id: socket.id }, "Login failed");
        socket.disconnect();
    });
});
http.listen(config_1.config.port, () => {
    logging_1.log.info('listening on *:' + config_1.config.port);
});
