import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Activation, Invitation } from '../../model/activation.model';


@Injectable()
export class ActivationService {

    invitation(code: string): Observable<Invitation> {
        return of ({
            id: 10,
            activated: false,
            creationDate: new Date(),
            email: 'tmjeeXxx@gmail.com'
        } as Invitation);
    }

    activate(code: string): Observable<Activation> {
        if (code === 'xxxx') {
            return of({
                registrationId: undefined,
                email: 'tmjee1@gmail.com',
                status: 'ERROR',
                username: undefined,
                message: `Bad code.`
            } as Activation);
        } else {
            return of({
                registrationId: 1,
                email: 'tmjee1@gmail.com',
                status: 'SUCCESS',
                username: 'tmjee1',
                message: `Activation for user is successfull.`
            } as Activation);
        }

    }
}
