import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';


@Injectable()
export class GlobalCommunicationService {

    avatarReloadSubject: Subject<number>; // emit when avatar needs updating

    constructor() {
        this.avatarReloadSubject = new Subject<number>();
    }

    avatarReloadObservable() {
        return this.avatarReloadSubject.asObservable();
    }
}
