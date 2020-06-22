import moment from "moment";

export const heartbeat = (): {date: string} => {
    const date = moment().format(`DD-MM-YYYY hh:mm:ss a`);
    return {
        date
    };
};