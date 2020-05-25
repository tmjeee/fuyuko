import {e} from "../logger";

export const checkErrors = (errors: string[], msg: string) => {
    if (errors && errors.length) {
        errors.forEach((error: string) => e(error));
        throw new Error(msg);
    }
};
