
const yaml = require('js-yaml');
const fs = require('fs');
export  type Config = {
    port: number;
    buyan : {
        name:string;
    }
    postgres:{
        host:string;
        port:number;
        user:string;
        password:string;
        database:string;
        max:number;
    }
}
export const config: Config =Object.assign({}, yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8')))
export default config;