import * as express from 'express';
import {log} from './logging';
const app = express();
import {Server,createServer} from 'http';
const http = createServer(app);
import {config} from './config';
import {createPool} from 'mysql';
const pool = createPool(config.mysql);
//const authentication = require('./lib/authentication');
import {AuthenticationManager,NoEncode} from './authentication';
import {SocketServer} from './socket';
let authenticate = new AuthenticationManager(pool,new NoEncode());
let server = new SocketServer(authenticate);
app.get('/', (req, res) => {
  pool.query("select 1",(err,result,fields) => {
    //RETURN HEALTCHECK
    if(err){
      res.send({socket:true,api:true,database:false});
    } else {
      res.send({socket:true,api:true,database:true});
    }
  });
});
let io = server.init(http, (io) => {
  //TODO set adapter
  log.info("INIT SOCKET.IO");
});

io.subscribe(socket => {
  //INIT SUCCESS
  log.info({id:socket.id},"CLIENT CONNECTED");
  //START TIMEOUT FOR AUTHENTICATE
  let timeout = setTimeout(()=> {
    log.warn("TIMEOUT FOR AUTHENTICATION");
    socket.disconnect();
  },5000);
  server.loginPhase(socket).then(username => {
    //LOGIN SUCCESS
    //CLEAR AUTHENTICATION TIMEOUT
    clearTimeout(timeout);
    log.info({user:username,id:socket.id},"Authentication success");
    socket.emit("login",username);
    socket.on('echo',(msg:any) => {
      log.info(msg,"Echo message");
      socket.emit('echo',msg);
    });
    server.disconnectPhase(socket).then( () => {
      //LOGOUT SUCCESS
      log.info({user:username,id:socket.id},"Disconneted")
    } ).catch(err => log.info(err));
  }).catch(err => {
    //CATCH FAILED LOGIN
    
    log.info({id:socket.id},"Login failed");
    socket.disconnect();
  });
});

http.listen(config.port,() =>{
  log.info('listening on *:'+config.port);
});