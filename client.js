const io = require('socket.io-client');
const socket_io = require('socket.io');
const crypto = require('crypto');
const capacity = 10;
//var sem = require('semaphore')(0);
for(let i=0;i<capacity;i++){
    const socket = io("http://localhost:3000");
    socket.on('connect', function(){
        console.log({"Connection with id":socket.id}); // 'G5p5...'
        socket.emit('login',{username:'client',password:'test'});
        setTimeout(function(){
            socket.disconnect();
        },60000);
        socket.on('login',function(msg){
            console.log(msg);
            socket.emit('echo',{msg:"HELLO!"});
            socket.on('echo',function(msg){
                console.log(msg);
            });
        });
        socket.on('disconnect',function(){
            console.log({"Disconnect with id":socket.id}); // 'G5p5...'
        //      sem.leave(1);
        });
    });

}
//sem.take(capacity);