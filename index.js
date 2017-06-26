const cluster = require('cluster');
const log =require('./lib/logging').log;
if(cluster.isMaster) {
    var numWorkers = 1;

    log.info({numWorkers:numWorkers},'Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        log.info({worker:worker.process.pid},'Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        log.info({worker:worker.process.pid,code:code,signal:signal},'Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        log.info('Starting a new worker');
        cluster.fork();
    });
} else {
    
    require('./lib/app');
}