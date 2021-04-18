import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '@fuyuko-common/model/user.model';

/**
 * usage :
 * <div *security="anyRole ['role1, 'role2]">
 *     <!-- will be visible when user have either 'role1' or 'role2'
 * <div>
 *
 * <div *security="noneOfRoles ['role1', 'role2']">
 *     <!-- will be visible when user have none of 'role1' and 'role2'  -->
 * </div>
 *
 * <div *security="allOfRoles ['role1', 'role2']">
 *     <!-- will be visible when user have all of the roles ('role1' and 'role2') -->
 * </div>
 */
@Directive({
    selector: '[security]'
})
export class SecurityDirective {

    constructor(private viewContainerRef: ViewContainerRef,
                private templateRef: TemplateRef<any>,
                private authService: AuthService) { }

    allowView() {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

    disallowView() {
        this.viewContainerRef.clear();
    }

    @Input() set securityAllOfRoles(roleNames: string[]) {
        if (roleNames && roleNames.length > 0) {
            const myself: User = this.authService.myself();
            if (myself && myself.groups && myself.groups.length) {
                for (const g of myself.groups) {
                    if (g.roles) {
                        for (const r of g.roles) {
                            if (!roleNames.includes(r.name)) {
                                this.disallowView();
                                return;
                            }
                        }
                    }
                }
                this.allowView();
                return;
            }
        }
        this.disallowView();
    }

    @Input() set securityAnyRole(roleNames: string[]) {
        if (roleNames && roleNames.length > 0) {
            const myself: User = this.authService.myself();
            if (myself && myself.groups) {
                for (const g of myself.groups) {
                    if (g.roles) {
                        for (const r of g.roles) {
                            if (roleNames.includes(r.name)) {
                                // any of the role name exists, create the embedded view
                                this.allowView();
                                return;
                            }
                        }
                    }
                }
            }
        }
        this.disallowView();
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
                                this.disallowView();
                                return;
                            }
                        }
                    }
                }
            }
            // when user does not have any of those roles, create embedded view
            this.allowView();
            return;
        }
        this.disallowView();
    }
}
