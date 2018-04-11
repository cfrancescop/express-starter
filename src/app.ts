const express =require('express')
import {log} from './logging';
import {Server,createServer} from 'http';
import {config} from './config';
import {pool} from './datasource';

const app = express();
const http = createServer(app);
http.listen(config.port,() =>{
  log.info('listening on *:'+config.port);
});