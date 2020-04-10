import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewService} from "../../service/view-service/view.service";
import {NotificationsService} from "angular2-notifications";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {map, tap} from "rxjs/operators";
import {View} from "../../model/view.model";
import {Subscription} from "rxjs";
import {Attribute} from "../../model/attribute.model";
import {EditAttributeComponentEvent} from "../../component/attribute-table-component/edit-attribute.component";
import {ApiResponse} from "../../model/api-response.model";
import {toNotifications} from "../../service/common.service";


@Component({
    templateUrl: './add-attribute.page.html',
    styleUrls: ['./add-attribute.page.scss']
})
export class AddAttributePageComponent implements OnInit {

    subscription: Subscription;
    currentView: View;
    attribute: Attribute;

    viewLoading: boolean;

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


    async onEditAttributeEvent($event: EditAttributeComponentEvent) {
        switch ($event.type) {
            case 'update':
                this.attributeService.addAttribute(this.currentView, $event.attribute).pipe(
                    tap((_: ApiResponse) => {
                        console.log('*********** add attribute response', _);
                        toNotifications(this.notificationService, _);
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
        this.attribute = {
            id: -1,
            type: 'string',
            name: '',
            description: '',
            creationDate: new Date(),
            lastUpdate: new Date()
        };
    }

}