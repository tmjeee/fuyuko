
import moment from 'moment';
import {Level} from '@fuyuko-common/model/level.model';
import {getThreadLocalStore, ThreadLocalStore} from "../service/thread-local.service";
import debug, {Debugger} from 'debug';

const log: Debugger = debug('fuyuko');

export const l = (level: Level, msg: string, ...a: any[]) => {
   switch(level) {
       case "DEBUG":
           d(msg, a);
           break;
       case "ERROR":
           e(msg, a);
           break;
       case "INFO":
           i(msg, a);
           break;
       case "WARN":
           w(msg, a);
           break;
   }
}

export const d = (msg: string, ...e: any[]) => {
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - [${reqUuid()}] - DEBUG - ${msg}`, ...e);
}

export const w = (msg: string, ...e: any[]) => {
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - [${reqUuid()}] - WARN - ${msg}`, ...e);
}

export const i = (msg: string, ...e: any[]) => {
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - [${reqUuid()}] - INFO - ${msg}`, ...e);
};

export const e = (msg: string, ...e: any[]) => {
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - [${reqUuid()}] - ERROR - ${msg}`, ...e);
};

const reqUuid = (): string => {
    const t: ThreadLocalStore = getThreadLocalStore();
    return t ? t.reqUuid : '<unknown>';
}

const reqUser = (): string => {
    const t: ThreadLocalStore = getThreadLocalStore();
    return t ? t.jwtPayload ? t.jwtPayload.user ? t.jwtPayload.user.username : '<unknown>' : '<unknown>' : '<unknown>';
}
