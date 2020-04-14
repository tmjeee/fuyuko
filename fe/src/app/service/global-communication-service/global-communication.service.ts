import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class GlobalCommunicationService {

    private subject = new Subject<string>();
    private avatarReloadSubject: Subject<number>; // emit when avatar needs updating

    constructor() {
        this.avatarReloadSubject = new Subject<number>();
        this.subject = new Subject<string>();
    }

    avatarReloadObservable() {
        return this.avatarReloadSubject.asObservable();
    }

    reloadAvatar() {
        this.avatarReloadSubject.next(Math.random());
    }


    asGlobalErrorObservable(): Observable<string> {
        return this.subject.asObservable();
    }

    publishGlobalError(err: string) {
        console.log('**** publish error', err);
        this.subject.next(err);
    }
}
