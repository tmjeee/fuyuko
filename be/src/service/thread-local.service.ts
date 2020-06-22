import {JwtPayload} from "../model/jwt.model";

const NAMESPACE = 'F-NAMESPACE';
const KEY = `F-KEY`;
const continuationLocalStorage = require(`continuation-local-storage`);
const createNamespace = continuationLocalStorage.createNamespace;
const getNamespace = continuationLocalStorage.getNamespace;

const NS = createNamespace(NAMESPACE);

export interface ThreadLocalStore {
    reqUuid: string;
    jwtPayload: JwtPayload
};

export const threadLocalInit = (fn: (ns: any) => void) => {
    NS.run(fn);
};

export const getThreadLocalStore = (): ThreadLocalStore => {
    return NS.get(KEY);
};

export const setThreadLocalStore = (v: ThreadLocalStore) => {
    NS.set(KEY, v);
};