import {i} from "../logger";


export const runTimezoner = (timezone: string) => {
    process.env.TZ = timezone;
    const d = new Date();
    i(`Timezone set to ${timezone}, Today's date time with locale is ${d.toString()}`);
};
