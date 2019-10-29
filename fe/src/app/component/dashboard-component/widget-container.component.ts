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
import {DashboardWidget, DashboardWidgetInstance} from '../../model/dashboard.model';


@Component({
    selector: 'app-widget-container',
    templateUrl: './widget-container.component.html',
    styleUrls: ['./widget-container.component.scss']

})
export class WidgetContainerComponent  implements OnInit, AfterViewInit {

    @Input() dashboardWidgetInstance: DashboardWidgetInstance;

    @ViewChild('container', {read: ViewContainerRef, static: true}) container: ViewContainerRef;

    componentRef: ComponentRef<DashboardWidget>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }


    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const componentFactory: ComponentFactory<DashboardWidget> =
               this.componentFactoryResolver.resolveComponentFactory(this.dashboardWidgetInstance.type);
            this.componentRef = this.container.createComponent(componentFactory);
        });
    }

    destroy() {
        this.container.clear();
    }

}
