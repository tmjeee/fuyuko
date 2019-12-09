
import moment from 'moment';
import {Level} from "../model/level.model";

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
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - DEBUG - ${msg}`, ...e);
}

export const w = (msg: string, ...e: any[]) => {
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - WARN - ${msg}`, ...e);
}

export const i = (msg: string, ...e: any[]) => {
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - INFO - ${msg}`, ...e);
};

export const e = (msg: string, ...e: any[]) => {
    console.error(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - ERROR - ${msg}`, ...e);
};
