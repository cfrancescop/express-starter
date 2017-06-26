import {Server} from 'http';
import {UsernamePassword,AuthenticationManager} from './authentication';
import {Observable,Observer} from 'rxjs';
import {config} from './config';
const socket_io = require('socket.io');
import {log} from './logging';
export declare interface Socket {
    id:string;
    on( event: string, listener: (msg:any) => void ):void;
    emit(event:string,msg:any):void;
    disconnect():void;
}
export declare interface SocketIO{
   on( event: 'connection', listener: ( socket: Socket ) => void ):void;
   adapter(adapter:any):void;
}
export class SocketServer{
    authManager:AuthenticationManager;
    io:SocketIO;
    constructor(authManager:AuthenticationManager){
        this.authManager=authManager;
    }
    public init(app:Server,decorator:(io:SocketIO) => (void)):Observable<Socket>{
        const io:SocketIO = socket_io(app);
        decorator(io);
        if(config.redis != null){
             log.info(config.redis,"Using redis adapter");
             const redis = require('socket.io-redis');
             io.adapter(redis({ host: 'localhost', port: 6379 }));
        }
        this.io = io;
        return Observable.create( (observer:any) => {
            io.on('connection',(socket:Socket) => {
                observer.next(socket);
            });
        } );
        //return observable;
    }
    public loginPhase(socket:Socket):Promise<string>{
        const authManager = this.authManager;
        return new Promise( (resolve,reject) => {
            socket.on('login',(login:UsernamePassword) =>{
                authManager.authenticate(login).then(resolve).catch(reject);
            });
        });
    }
    public disconnectPhase(socket:Socket){
        return new Promise( (resolve,error) => {
            socket.on('disconnect',function(){
                log.info({msg:"disconnecting"});
                resolve();
            });
        });
    }
}
