import {i} from '../logger';

export const runTimezoner = (timezone: string) => {
    // set node process env and run Date() to make sure timezone is setup in node
    process.env.TZ = timezone;
    const d = new Date();
    i(`Timezone set to ${timezone}, Today's date time with locale is ${d.toString()}`);
};
