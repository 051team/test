import { createClient } from 'redis';

const redclient = createClient({
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!)
    }
})  

redclient.on('error', err => console.log('Redis Client Error', err));

if(!redclient.isOpen){
    redclient.connect();
}

export {redclient}