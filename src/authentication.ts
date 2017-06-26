import {IPool,IError,IFieldInfo} from 'mysql';
import {log} from './logging';
import {config} from './config';
import {pool} from './datasource';
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

    private query:string;
    constructor(){
        if(config.authentication.encoder == null || config.authentication.encoder === 'NoEncode'){
            this.encoder = new NoEncode();
        }
        //TODO BCrypt
    }
    public authenticate(auth:UsernamePassword){
      
        const encoder = this.encoder;
        const queryAuth = config.authentication.query;
        return new Promise( (res, err) => {
            if(auth == null || auth.username == null){
                err({error:'Invalid Username/Password'});
            }
            log.info({q:queryAuth,param:auth.username},"Query for username");
            pool.query(queryAuth,[auth.username]).then( results =>{
                log.info("Query completed")
                if(results == null){
                    err({error:'Internal Server Error'});
                    return
                }
                console.log(results);
                if(pool.length(results) != 1){
                    log.info("NO RESULT");
                    err({error:'Invalid Username/Password'});
                    return;
                }
                
                let result =pool.get( results,0);
                if(encoder.matches(auth.password , result.password)){
                    //OK 
                    res(result.username);
                } else {
                    log.info("NO MATCH");
                    err({msg:'Invalid Username/Password'});
                }
            }).catch(error => {
                log.warn(error);
                err(error);
            });
        });
    }
}
