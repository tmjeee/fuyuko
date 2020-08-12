import {e} from "../logger";

export const checkErrors = (errors: string[], msg: string) => {
    if (errors && errors.length) {
        errors.forEach((error: string) => e(error));
        throw new Error(msg);
    }
};

export const checkNotNull = (i: any, msg: string) => {
    if (i == null || i == undefined) {
        throw new Error(msg);
    }
};

export const checkTrue = (i: boolean, msg: string) => {
    if (!i) {
        throw new Error(msg);
    }
}
