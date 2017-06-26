"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const config_1 = require("./config");
const socket_io = require('socket.io');
const logging_1 = require("./logging");
class SocketServer {
    constructor(authManager) {
        this.authManager = authManager;
    }
    init(app, decorator) {
        const io = socket_io(app);
        decorator(io);
        if (config_1.config.redis != null) {
            logging_1.log.info(config_1.config.redis, "Using redis adapter");
            const redis = require('socket.io-redis');
            io.adapter(redis({ host: 'localhost', port: 6379 }));
        }
        this.io = io;
        return rxjs_1.Observable.create((observer) => {
            io.on('connection', (socket) => {
                observer.next(socket);
            });
        });
    }
    loginPhase(socket) {
        const authManager = this.authManager;
        return new Promise((resolve, reject) => {
            socket.on('login', (login) => {
                authManager.authenticate(login).then(resolve).catch(reject);
            });
        });
    }
    disconnectPhase(socket) {
        return new Promise((resolve, error) => {
            socket.on('disconnect', function () {
                logging_1.log.info({ msg: "disconnecting" });
                resolve();
            });
        });
    }
}
exports.SocketServer = SocketServer;
