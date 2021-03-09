import moment from 'moment';

class HeartbeatService {
    heartbeat(): {date: string} {
        const date = moment().format(`DD-MM-YYYY hh:mm:ss a`);
        return {
            date
        };
    };
}

const s = new HeartbeatService()

export const heartbeat =  s.heartbeat.bind(this)
