import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {map} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';


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

    constructor(private viewService: ViewService,
                private formBuilder: FormBuilder) {
        this.formControlView = this.formBuilder.control(null);
        this.events = new EventEmitter<View>();
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
                    this.subscription = this.viewService
                        .asObserver()
                        .pipe(
                            map((v: View) => {
                                if (v) {
                                    this.currentView = this.allViews ? this.allViews.find((vv: View) => vv.id === v.id) : undefined;
                                    this.formControlView.setValue(v);
                                    this.events.emit(v);
                                } else { // no current view yet
                                    if (!this.currentView && this.allViews.length) {
                                        this.viewService.setCurrentView(this.allViews[0]);
                                    }
                                }
                            })
                        ).subscribe();
                })
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


}
