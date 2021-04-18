import {JwtPayload} from '@fuyuko-common/model/jwt.model';

import * as h from 'cls-hooked';
const NAMESPACE = 'F-NAMESPACE';
const KEY = `F-KEY`;

const NS = h.createNamespace(NAMESPACE);

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