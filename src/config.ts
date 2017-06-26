export const config:any =require('../config.json');

export declare class Config{
    port: number;
    buyan : {
        name:string;
    }
    mysql:any;
    redis:any;
    /*
    redis : {
        host:string;
        port:number;
    }
    mysql:{
        host:string;
        user:string;
        password:string;
        database:string;
        connectionLimit:number;
    }*/
    postgres:{
        host:string;
        port:number;
        user:string;
        password:string;
        database:string;
        max:number;
    }
    authentication:{
        query:string;
        encoder:string;
    }
}