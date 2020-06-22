import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class LoadingService {

    private subject: BehaviorSubject<boolean>;

    constructor() {
        this.subject = new BehaviorSubject<boolean>(undefined);
    }

    asObservable(): Observable<boolean> {
        return this.subject.asObservable();
    }

    stopLoading() {
        this.subject.next(false);
    }

    startLoading() {
        this.subject.next(true);
    }

}