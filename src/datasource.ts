import {log} from './logging';
import {config} from './config';
import * as pg from  'pg';
import * as mysql from 'mysql';

export class Pool  {
    constructor(){
        
    }
    query:(text:string, values:any[]) => Promise<any>
    length:(result:any) => number;
    get:(result:any,row:number) => any
}
export const pool:Pool = new Pool();
if (config.mysql != null){
    
    const mysqlPool =mysql.createPool(config.mysql);
    pool.length = (result) => result.length;
    pool.get = (result,index) => result[index];
    pool.query = function (text:string, values:any[]) {
        log.info({query: text,values: values});
        return new Promise((resolve,reject) => { 
            mysqlPool.query(text, values, (err,result,fields) => {
                if(err){
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
} else if (config.postgres != null){
    const pgPool = new pg.Pool(config.postgres);
    pgPool.on('error',function(err,client){
        log.warn({err:err,client:client},"PG ERROR");
    });
    pool.length = (result:pg.QueryResult) => result.rowCount;
    pool.get = (result:pg.QueryResult,index:number) =>  result.rows[index];
    pool.query = function (text:string, values:any[]) {
        log.info({query: text,values: values});
        return new Promise( (resolve,reject) => {
            pgPool.query(text, values, (err, res) => {
                if(err){
                    reject(err);
                } else {
                    resolve(res);
                }
            } );
        });
    };
} else {
    pool.query = function (text:string, values:any[]) {
        log.error("NO DATASOURCE DEFINED");
        return new Promise((resolve,reject) =>{
            reject({error:"NO DATASOURCE DEFINED"});
        });
    }
}
