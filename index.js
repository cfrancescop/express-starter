

const app = require('express')();
const http = require('http').Server(app);
const config =require('./config.json');


const util = require('util');

const io = require('socket.io')(http);

const redis = require('socket.io-redis');
if (config.redis != null){
    io.adapter(redis(config.redis));
}
const mysql      = require('mysql');
const pool = mysql.createPool(config.mysql);

app.get('/', function(req, res){
  res.sendStatus(200);
});
/**
 * 
 * @param {SocketIO.socket} socket : SocketIO.Socket
 */
function scheduledActivity(socket){
    console.log({"Scheduled client operation":socket.id});
}
function authenticate(auth){
  return new Promise(function (err, res){
    pool.query("SELECT USERNAME,PASSWORD FROM users WHERE USERNAME=?",[auth.username],function(error,results,fields){
      if (error) err(error);
      if(results.length != 1){
        err({error:'Invalid Username/Password'});
      }
      let result = results[0];
      if(auth.password == result.password){
        //OK 
        res(result.username);
      } else {
        err({error:'Invalid Username/Password'});
      }
    });
  });
}
io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('login',function(auth){
      authenticate(auth).then(auth => {
        console.log('Login success');
        socket.emit('login.success',auth);
        //START ACTIVITY ONLY IF LOGGED
        let timer = setInterval(scheduledActivity,1000,socket);
        socket.on('disconnect', function(){
            console.log('user disconnected');
            //STOP THE SCHEDULED JOB
            clearInterval(timer);
        });
      }).catch(err => {
        console.log(err);
        socket.disconnect();
      });
  });
});
http.listen(config.port, function(){
  console.log('listening on *:'+config.port);
});