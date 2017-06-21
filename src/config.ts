export const config:Config =require('../config.json');

export declare class Config{
    port: number;
    buyan : {
        name:string;
    }
    redis : {
        host:string;
        port:number;
    };
    mysql:{
        host:string;
        user:string;
        password:string;
        database:string;
        connectionLimit:number;
    }
    authentication:{
        query:string;
    }
}