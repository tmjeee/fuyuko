import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Settings} from '../../model/settings.model';
import {User} from '../../model/user.model';

export interface SettingsComponentEvent {
    settings: Settings;
}


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnChanges {

    formGroupGeneralTab: FormGroup;
    formControlOpenHelpNav: FormControl;
    formControlOpenSideNav: FormControl;
    formControlOpenSubSideNav: FormControl;

    @Input() settings: Settings;
    @Input() user: User;
    @Output() events: EventEmitter<SettingsComponentEvent>;

    constructor(private formBuilder: FormBuilder) {

        this.events = new EventEmitter<SettingsComponentEvent>();

        // general tab
        this.formControlOpenHelpNav = formBuilder.control('', [Validators.required]);
        this.formControlOpenSideNav = formBuilder.control('', [Validators.required]);
        this.formControlOpenSubSideNav = formBuilder.control('', [Validators.required]);
        this.formGroupGeneralTab = formBuilder.group({
            defaultOpenHelpNav: this.formControlOpenHelpNav,
            defaultOpenSideNav: this.formControlOpenSideNav,
            defaultOpenSubSideNav: this.formControlOpenSubSideNav
        });
    }

    ngOnInit(): void {
        this.populate(this.settings);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.settings) {
            const change: SimpleChange =  changes.settings;
            const s: Settings = change.currentValue;
            this.populate(s);
        }
    }

    populate(s: Settings) {
        if (s) {
            this.formControlOpenHelpNav.setValue(s.openHelpNav);
            this.formControlOpenSideNav.setValue(s.openSideNav);
            this.formControlOpenSubSideNav.setValue(s.openSubSideNav);
        }
    }

    onGeneralTabSubmit() {
        const s: Settings = {...this.settings};
        s.openHelpNav = this.formControlOpenHelpNav.value;
        s.openSideNav = this.formControlOpenSideNav.value;
        s.openSubSideNav = this.formControlOpenSubSideNav.value;
        this.events.emit({
            settings: s
        } as SettingsComponentEvent);
    }
}
