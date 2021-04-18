import {
    AfterViewInit,
    Component,
    ComponentFactory,
    ComponentFactoryResolver, ComponentRef,
    Input,
    OnInit,
    ViewChild, ViewContainerRef
} from '@angular/core';
import {DashboardWidget, DashboardWidgetInstance} from './dashboard.model';
import {DashboardWidgetService} from '../../service/dashboard-service/dashboard-widget.service';
import {User} from '@fuyuko-common/model/user.model';


@Component({
    selector: 'app-widget-container',
    templateUrl: './widget-container.component.html',
    styleUrls: ['./widget-container.component.scss'],
    providers: [
        { provide: DashboardWidgetService, useClass: DashboardWidgetService }
    ]
})
export class WidgetContainerComponent  implements OnInit, AfterViewInit {

    @Input() currentUser: User;
    @Input() dashboardWidgetInstance: DashboardWidgetInstance;

    @ViewChild('container', {read: ViewContainerRef, static: true}) container: ViewContainerRef;

    componentRef: ComponentRef<DashboardWidget>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private dashboardWidgetService: DashboardWidgetService) { }


    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const componentFactory: ComponentFactory<DashboardWidget> =
               this.componentFactoryResolver.resolveComponentFactory(this.dashboardWidgetInstance.type);
            this.componentRef = this.container.createComponent(componentFactory);
            this.dashboardWidgetService.currentUser = this.currentUser;
            this.dashboardWidgetService.widgetInstance = this.dashboardWidgetInstance;
        });
    }

    destroy() {
        this.container.clear();
    }

}
