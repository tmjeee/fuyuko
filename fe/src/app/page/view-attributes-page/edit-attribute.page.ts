import {Component, OnInit, OnDestroy} from '@angular/core';
import {Attribute} from '../../model/attribute.model';
import {FormBuilder} from '@angular/forms';
import {map, tap} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ViewService} from '../../service/view-service/view.service';
import {NotificationsService} from 'angular2-notifications';
import {EditAttributeComponentEvent} from '../../component/attribute-table-component/edit-attribute.component';

@Component({
    templateUrl: './edit-attribute.page.html',
    styleUrls: ['./edit-attribute.page.scss']
})
export class EditAttributePageComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    currentView: View;
    attribute: Attribute;

    viewLoading: boolean;
    attributeLoading: boolean;

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private viewService: ViewService,
                private notificationService: NotificationsService,
                private attributeService: AttributeService) {
    }



    ngOnInit(): void {
        this.viewLoading = true;
        this.subscription = this.viewService
            .asObserver()
            .pipe(
                map((v: View) => {
                    if (v) {
                        this.currentView = v;
                        this.reload();
                        this.viewLoading = false;
                    }
                })
            ).subscribe();
    }


    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async onEditAttributeEvent($event: EditAttributeComponentEvent) {
        switch ($event.type) {
            case 'update':
                this.attributeService.updateAttribute(this.currentView, $event.attribute).pipe(
                    tap((_) => {
                        this.notificationService.success(`Attribute Updated`, `Attribute Updated Successfully`);
                        this.reload();
                    })
                ).subscribe();
                break;
            case 'cancel':
                await this.router.navigate(['/view-gen-layout', {outlets: {primary: ['attributes'], help: ['view-help'] }}]);
                break;
        }
    }

    reload() {
        this.attributeLoading = true;
        this.attributeService.getAttributeByView(this.currentView.id, this.attribute.id).pipe(
            tap((a: Attribute) => {
                this.attribute = a;
                this.attributeLoading = false;
            })
        ).subscribe();
    }
}
