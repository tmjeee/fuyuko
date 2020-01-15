import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '../../model/user.model';

/**
 * usage :
 * <div *security="anyRole ['role1, 'role2]">
 *     <!-- will be visible when user have either 'role1' or 'role2'
 * <div>
 *
 * <div *security="noneOfRoles ['role1', 'role2']">
 *     <!-- will be visible when user have none of 'role1' and 'role2'  -->
 * </div>
 */
@Directive({
    selector: '[security]'
})
export class SecurityDirective {

    constructor(private viewContainerRef: ViewContainerRef,
                private templateRef: TemplateRef<any>,
                private authService: AuthService) { }


    @Input() set securityAnyRole(roleNames: string[]) {
        if (roleNames && roleNames.length > 0) {
            const myself: User = this.authService.myself();
            if (myself && myself.groups) {
                for (const g of myself.groups) {
                    if (g.roles) {
                        for (const r of g.roles) {
                            if (roleNames.includes(r.name)) {
                                // any of the role name exists, create the embedded view
                                this.viewContainerRef.createEmbeddedView(this.templateRef);
                                return;
                            }
                        }
                    }
                }
            }
        }
        this.viewContainerRef.clear();
    }

    @Input() set securityNoneOfRoles(roleNames: string[]) {
        if (roleNames && roleNames.length > 0) {
            const myself: User = this.authService.myself();
            if (myself && myself.groups) {
                for (const g of myself.groups) {
                    if (g.roles) {
                        for (const r of g.roles) {
                            if (roleNames.includes(r.name)) {
                                // any of the role name exists, clear view container
                                this.viewContainerRef.clear();
                                return;
                            }
                        }
                    }
                }
            }
            // when user does not have any of those roles, create embedded view
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
        this.viewContainerRef.clear();
    }
}
