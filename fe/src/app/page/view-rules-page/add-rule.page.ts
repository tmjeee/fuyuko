import {ViewService} from "../../service/view-service/view.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {NotificationsService} from "angular2-notifications";
import {RuleService} from "../../service/rule-service/rule.service";
import {Component} from "@angular/core";
import {AbstractRulePageComponent} from "./abstract-rule.page";


@Component({
    templateUrl: './add-rule.page.html',
    styleUrls: ['./add-rule.page.scss']
})
export class AddRulePageComponent extends AbstractRulePageComponent {
    constructor(protected viewService: ViewService,
                protected route: ActivatedRoute,
                protected attributeService: AttributeService,
                protected notificationService: NotificationsService,
                protected router: Router,
                protected ruleService: RuleService) {
        super(viewService, route, attributeService, notificationService, router, ruleService);
    }

}