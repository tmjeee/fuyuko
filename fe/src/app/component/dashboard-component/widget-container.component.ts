import {
    AfterViewChecked, AfterViewInit,
    Component,
    ComponentFactory,
    ComponentFactoryResolver, ComponentRef,
    Input,
    OnInit,
    TemplateRef,
    Type,
    ViewChild, ViewContainerRef
} from '@angular/core';
import {DashboardWidget} from '../../model/dashboard.model';


@Component({
    selector: 'app-widget-container',
    templateUrl: './widget-container.component.html',
    styleUrls: ['./widget-container.component.scss']

})
export class WidgetContainerComponent  implements OnInit, AfterViewInit {

    // @Input() dashboardWidgetType: DashboardWidgetType;
    @Input() dashboardWidgetType: Type<DashboardWidget>;

    @ViewChild('container', {read: ViewContainerRef, static: true}) container: ViewContainerRef;

    componentRef: ComponentRef<DashboardWidget>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }


    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const componentFactory: ComponentFactory<DashboardWidget> =
                this.componentFactoryResolver.resolveComponentFactory(this.dashboardWidgetType);
            this.componentRef = this.container.createComponent(componentFactory);

            // const componentFactory: ComponentFactory<DashboardWidget> =
            //    this.componentFactoryResolver.resolveComponentFactory(this.dashboardWidgetType.type);
            // this.componentRef = this.container.createComponent(componentFactory);
            // const component: DashboardWidget = this.componentRef.instance;
            // component.serializeData(dashboardWidgetType.data);
        });
    }


}
