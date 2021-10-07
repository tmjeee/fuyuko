import {Component, OnInit} from '@angular/core';
import {PricingStructureGroupAssociation} from '@fuyuko-common/model/pricing-structure.model';
import { GroupSearchFn } from '../../component/group-table-component/group-table.component';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Group} from '@fuyuko-common/model/group.model';
import {PricingStructureService} from '../../service/pricing-structure-service/pricing-structure.service';
import {PricingStructureGroupAssociationComponentEvent} from '../../component/pricing-component/pricing-structure-group-association.component';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
    templateUrl: './pricing-structure-partner-association.page.html',
    styleUrls: ['./pricing-structure-partner-association.page.scss']
})
export class PricingStructurePartnerAssociationPageComponent implements OnInit {

    loading = true;
    pricingStructureGroupAssociations: PricingStructureGroupAssociation[] = [];
    groupSearchFnsMap!: Map<number /* pricingStructureId */, GroupSearchFn>;

    constructor(private userManagementService: UserManagementService,
                private notificationsService: NotificationsService,
                private pricingStructureService: PricingStructureService,
                private loadingService: LoadingService) {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.loading = true;
        this.loadingService.startLoading();
        this.groupSearchFnsMap = new Map();
        this.pricingStructureService.getPricingStructureGroupAssociation()
            .pipe(
                tap((r: PricingStructureGroupAssociation[]) => {
                    this.pricingStructureGroupAssociations = r;
                    for (const r2 of r) {
                        this.groupSearchFnsMap.set(r2.pricingStructure.id, (group: string): Observable<Group[]> => {
                            return this.userManagementService.findGroupsNotAssociatedWithPricingStructure(r2.pricingStructure.id, group);
                        });
                    }
                    this.loading = false;
                }),
                finalize(() => {
                    this.loading = false;
                    this.loadingService.stopLoading();
                })
            ).subscribe();
    }


    onPricingStructureGroupAssociationEvent($event: PricingStructureGroupAssociationComponentEvent) {
        switch ($event.type) {
            case 'link': {
                this.pricingStructureService.linkPricingStructureGroup($event.pricingStructure.id, $event.group.id)
                    .pipe(
                        tap((r: ApiResponse) => {
                            const g: Group = $event.group;
                            const a: PricingStructureGroupAssociation | undefined =
                                this.pricingStructureGroupAssociations.find((
                                    a2: PricingStructureGroupAssociation) => a2.pricingStructure.id === $event.pricingStructure.id);
                            this.userManagementService.findGroupsAssociatedWithPricingStructure($event.pricingStructure.id, '').pipe(
                                tap((g2: Group[]) => {
                                    if (a) {
                                        a.groups = g2;
                                    }
                                })
                            ).subscribe();
                            toNotifications(this.notificationsService, r);
                        })
                    ).subscribe();
                break;
            }
            case 'unlink': {
                this.pricingStructureService.unlinkPricingStructureGroup($event.pricingStructure.id, $event.group.id).pipe(
                    tap((r: ApiResponse) => {
                        const g: Group = $event.group;
                        const a: PricingStructureGroupAssociation | undefined =
                            this.pricingStructureGroupAssociations.find(
                                (a2: PricingStructureGroupAssociation) => a2.pricingStructure.id === $event.pricingStructure.id);
                        this.userManagementService.findGroupsAssociatedWithPricingStructure($event.pricingStructure.id, '').pipe(
                            tap((g2: Group[]) => {
                                if (a) {
                                    a.groups = g2;
                                }
                            })
                        ).subscribe();
                        toNotifications(this.notificationsService, r);
                    })
                ).subscribe();
                break;
            }
        }
    }

    reloadClicked($event: MouseEvent) {
        this.reload();
    }
}
