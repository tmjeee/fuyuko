import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {Subscription} from "rxjs";
import {tap} from "rxjs/operators";
import {GlobalCommunicationService} from "../../service/global-communication-service/global-communication.service";


/**
 * Like *ngIf but will not show if there is a global error, use this instead of ngIf for loading messages
 *
 * <div *loadIf="isLoading">
 *    will show until isLoading is false or when an error is found in global-error-handler.service.ts
 * </div>
 */

@Directive({
    selector: '[loadIf]'
})
export class LoadIfDirective implements OnInit, OnDestroy {

    private subscription: Subscription;

    constructor(private viewContainerRef: ViewContainerRef,
                private templateRef: TemplateRef<any>,
                private globalCommunicationService: GlobalCommunicationService
    ) {

    }

    @Input() set loadIf(condition: any) {
        if (condition) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainerRef.clear();
        }
    }

    ngOnInit(): void {
        this.subscription = this.globalCommunicationService.asGlobalErrorObservable()
            .pipe(
                tap((err: string) => {
                    this.viewContainerRef.clear();
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        this.subscription && this.subscription.unsubscribe();
    }
}