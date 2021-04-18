import {Component, OnInit} from '@angular/core';
import {PasswordComponentEvent} from '../../component/password-component/password.component';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../service/auth-service/auth.service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {tap} from 'rxjs/operators';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPageComponent implements OnInit {

    status: 'SUCCESS' | 'ERROR';
    message: string;
    code: string;

    disabled: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private notificationsService: NotificationsService,
                private authService: AuthService) {
        this.disabled = true;
    }

    ngOnInit(): void {
        this.code = this.activatedRoute.snapshot.paramMap.get('code');
        if (this.code) {
            this.authService.forgotPasswordCheck(this.code).pipe(
                tap((r: ApiResponse<boolean>) => {
                    this.status = (r.payload ? 'SUCCESS' : 'ERROR');
                    this.message = (r.payload ? 'Valid code' : 'Bad code');
                    this.disabled = !r.payload;
                })
            ).subscribe();
        } else {
            this.status = ('ERROR');
            this.message = 'Missing code';
            this.disabled = true;
        }
    }

    onPasswordEvent($event: PasswordComponentEvent) {
        this.authService.forgotPasswordReset(this.code, $event.password).pipe(
            tap((r: ApiResponse) => {
                toNotifications(this.notificationsService, r);
            })
        ).subscribe();
    }

}
