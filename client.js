const io = require('socket.io-client');
const socket_io = require('socket.io');
const crypto = require('crypto');
const capacity = 1;
//var sem = require('semaphore')(0);
const timer = setInterval(function(){
for(let i=0;i<capacity;i++){
    const socket = io("http://localhost:3000");
    socket.on('connect', function(){
        console.log({"Connection with id":socket.id}); // 'G5p5...'
        socket.emit('login',{username:'client',password:'test'});
        let status = {
            success:false
        }
        setTimeout(function(){
            socket.disconnect();
        },10000);
        socket.on('login',function(msg){
            console.log(msg);
            socket.emit('echo',{msg:"HELLO!"});
            socket.on('echo',function(msg){
                console.log(msg);
                status.success=true;
            });
        });
        socket.on('disconnect',function(){
            console.log({"Disconnect with id":socket.id,status:status}); // 'G5p5...'
        //      sem.leave(1);
        });
    });

}},5000);
setTimeout(function(){
    clearInterval(timer);
},100000);
//sem.take(capacity);