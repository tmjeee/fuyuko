import {Component} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {NotificationsService} from 'angular2-notifications';
import {RuleService} from '../../service/rule-service/rule.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractRulePageComponent} from './abstract-rule.page';
import {LoadingService} from '../../service/loading-service/loading.service';

@Component({
    templateUrl: './edit-rule.page.html',
    styleUrls: ['./edit-rule.page.scss']
})
export class EditRulePageComponent extends AbstractRulePageComponent {

    constructor(protected viewService: ViewService,
                protected route: ActivatedRoute,
                protected attributeService: AttributeService,
                protected notificationService: NotificationsService,
                protected router: Router,
                protected ruleService: RuleService,
                protected loadingService: LoadingService) {
        super(viewService, route, attributeService, notificationService, router, ruleService, loadingService);
    }
}
