import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {map} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatSelectChange} from "@angular/material/select";


@Component({
    selector: 'app-view-selector',
    templateUrl: './view-selector.component.html',
    styleUrls: ['./view-selector.component.scss']
})
export class ViewSelectorComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    currentView: View;

    allViews: View[];

    ready: boolean;
    formControlView: FormControl;

    @Output() events: EventEmitter<View>;
    @Input() setCurrentActiveView: boolean;

    constructor(private viewService: ViewService,
                private formBuilder: FormBuilder) {
        this.formControlView = this.formBuilder.control(null);
        this.events = new EventEmitter<View>();
        this.setCurrentActiveView = true;
    }

    ngOnInit(): void {
        this.viewService
            .getAllViews()
            .pipe(
                map((v: View[]) => {
                    this.allViews = v;
                    this.ready = true;
                }),
                map(() => {
                    if (this.setCurrentActiveView) {
                        this.subscription = this.viewService
                            .asObserver()
                            .pipe(
                                map((v: View) => {
                                    if (v) {
                                        this.currentView = this.allViews ? this.allViews.find((vv: View) => vv.id === v.id) : undefined;
                                        this.formControlView.setValue(this.currentView);
                                        this.events.emit(v);
                                    } else { // no current view yet
                                        if (!this.currentView && this.allViews.length) {
                                            this.viewService.setCurrentView(this.allViews[0]);
                                        }
                                    }
                                })
                            ).subscribe();
                    }
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


    onViewSelectionChanged($event: MatSelectChange) {
        const view: View = $event.value;
        if (view) {
            this.events.emit(view);
        }
    }
}
