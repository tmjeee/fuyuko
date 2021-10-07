
export const assertDefined = (a: any, msg: string | undefined = undefined) => {
    if (a === null || a === undefined) {
        throw Error(`Expect ${msg ? msg : a} to be defined`);
    }
};

export const assertDefinedReturn = <T>(a: T | undefined | null, msg: string | undefined = undefined): T => {
    if (a === null || a === undefined) {
        throw Error(`Expect ${msg ? msg : a} to be defined`);
    }
    return a;
};
