import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PricingStructure, PricingStructureGroupAssociation} from '@fuyuko-common/model/pricing-structure.model';
import {
    Action,
    GroupSearchFn,
    GroupTableComponentEvent,
    SEARCH_ACTION_TYPE
} from '../group-table-component/group-table.component';
import {Group} from '@fuyuko-common/model/group.model';


export interface PricingStructureGroupAssociationComponentEvent {
    type: 'link' | 'unlink';
    group: Group;
    pricingStructure: PricingStructure;
}

@Component({
    selector: 'app-pricing-structure-group-association',
    templateUrl: './pricing-structure-group-association.component.html',
    styleUrls: ['./pricing-structure-group-association.component.scss']
})
export class PricingStructureGroupAssociationComponent implements OnInit {

   actions: Action[] = [];

   @Input() pricingStructureGroupAssociations: PricingStructureGroupAssociation[] = [];
   @Input() groupSearchFnsMap!: Map<number /* pricingStructureId */, GroupSearchFn>;

   @Output() events: EventEmitter<PricingStructureGroupAssociationComponentEvent>;

    constructor() {
        this.events = new EventEmitter<PricingStructureGroupAssociationComponentEvent>();
    }


    ngOnInit(): void {
       this.actions = [{
           type: 'unlink', tooltip: 'unlink group from pricing sturcture', icon: 'link_off'
       }];
   }


    onGroupTableEvent($event: GroupTableComponentEvent, pricingStructure: PricingStructure) {
       switch ($event.type) {
           case 'unlink': {
               const g: Group = $event.group;
               this.events.emit({
                   type: 'unlink',
                   group: g,
                   pricingStructure
               } as PricingStructureGroupAssociationComponentEvent);
               break;
           }
           case SEARCH_ACTION_TYPE: {
               const g: Group = $event.group;
               this.events.emit({
                   type: 'link',
                   group: g,
                   pricingStructure
               } as PricingStructureGroupAssociationComponentEvent);
               break;
           }
       }
    }
}
