import {} from 'events';

export class Lock {
    private p: Promise<any>;

    constructor() {
        this.p = Promise.resolve();
    }

    doInLock<T>(fn: () => Promise<T>): Promise<T> {
        this.p = this.p.then((_) => {
            return fn();
        }).catch((e) => {
            console.error(e);
        })
        return this.p;
    }
}

/*
const lock = new Lock();

lock.doInLock(() => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log('lock1');
            res();
        }, 1000)
    });
}).then((_) => console.log('lock1 done'));
lock.doInLock(() => {
    return new Promise((res, rej) => {
        console.log('lock2');
        res();
    });
}).then((_) => console.log('lock2 done'));
lock.doInLock(() => {
    return new Promise((res, rej) => {
        console.log('lock3');
        // res();
        throw new Error('test');
    });
}).then((_) => console.log('lock3 done'));
lock.doInLock(() => {
    return new Promise((res, rej) => {
        console.log('lock4');
        res();
    });
}).then((_) => console.log('lock4 done'));
lock.doInLock(() => {
    return new Promise((res, rej) => {
        console.log('lock5');
        res();
    });
}).then((_) => console.log('lock5 done'));
lock.doInLock(() => {
    return new Promise((res, rej) => {
        console.log('lock6');
        res();
    });
}).then((_) => console.log('lock6 done'));




lock.doInLock(() => {
    return new Promise((res, rej) => {
        console.log('lockxxx');
        res();
    });
}).then((_) => console.log('lockxxx done'));
 */
