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

class ThreadLocalService {
    threadLocalInit(fn: (ns: any) => void) {
        NS.run(fn);
    };

    getThreadLocalStore(): ThreadLocalStore {
        return NS.get(KEY);
    };

    setThreadLocalStore(v: ThreadLocalStore) {
        NS.set(KEY, v);
    };
}

const s = new ThreadLocalService();
export const
    threadLocalInit = s.threadLocalInit.bind(s),
    getThreadLocalStore = s.getThreadLocalStore.bind(s),
    setThreadLocalStore = s.setThreadLocalStore.bind(s);