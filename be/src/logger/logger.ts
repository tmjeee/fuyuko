
import moment from 'moment';

export const i = (msg: string, ...e: any[]) => {
    console.log(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - INFO - ${msg}`, ...e);
};

export const e = (msg: string, ...e: any[]) => {
    console.error(`[${moment().format('MM-DD-YYYY hh:mm:ss a')}] - ERROR - ${msg}`, ...e);
};
