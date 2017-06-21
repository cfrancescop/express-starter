import {IPool,IError,IFieldInfo} from 'mysql';
import {log} from './logging';
import {config} from './config';
export class UsernamePassword{
    username:string;
    password:string;
}
export interface PasswordEncoder{
    matches(input:string,encoded:string):boolean;
    encode(input:string):string;
}
export class NoEncode implements PasswordEncoder{
    matches(input:string,encoded:string):boolean{
        //console.log([input,encoded]);
        return input === encoded;
    }
    encode(input:string):string{
        return input;
    }
}
export class AuthenticationManager{
    private encoder:PasswordEncoder;
    private pool:IPool;
    private query:string;
    constructor(pool:IPool,encder:PasswordEncoder){
        this.pool = pool;
        this.encoder = encder;
    }
    public authenticate(auth:UsernamePassword){
        const pool = this.pool;
        const encoder = this.encoder;
        const query = config.authentication.query;
        return new Promise( (res, err) => {
            if(auth == null || auth.username == null){
                err({error:'Invalid Username/Password'});
            }
            log.info({q:query,param:auth.username},"Query for username");
            pool.query(query,[auth.username],(error:IError,results,fields) =>{
                log.info("Query completed")
                if (error) err(error);
                if(results.length != 1){
                    log.info("NO RESULT");
                    err({error:'Invalid Username/Password'});
                    return;
                }
                
                let result = results[0];
                if(encoder.matches(auth.password , result.password)){
                    //OK 
                    res(result.username);
                } else {
                    log.info("NO MATCH");
                    err({msg:'Invalid Username/Password'});
                }
            });
        });
    }
}
