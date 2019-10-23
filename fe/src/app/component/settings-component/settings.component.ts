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
    formControlDefaultOpenHelpNav: FormControl;
    formControlDefaultOpenSideNav: FormControl;
    formControlDefaultOpenSubSideNav: FormControl;

    @Input() settings: Settings;
    @Input() user: User;
    @Output() events: EventEmitter<SettingsComponentEvent>;

    constructor(private formBuilder: FormBuilder) {

        this.events = new EventEmitter<SettingsComponentEvent>();

        // general tab
        this.formControlDefaultOpenHelpNav = formBuilder.control('', [Validators.required]);
        this.formControlDefaultOpenSideNav = formBuilder.control('', [Validators.required]);
        this.formControlDefaultOpenSubSideNav = formBuilder.control('', [Validators.required]);
        this.formGroupGeneralTab = formBuilder.group({
            defaultOpenHelpNav: this.formControlDefaultOpenHelpNav,
            defaultOpenSideNav: this.formControlDefaultOpenSideNav,
            defaultOpenSubSideNav: this.formControlDefaultOpenSubSideNav
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
        console.log('****** settings', s);
        this.formControlDefaultOpenHelpNav.setValue(s.defaultOpenHelpNav);
        this.formControlDefaultOpenSideNav.setValue(s.defaultOpenSideNav);
        this.formControlDefaultOpenSubSideNav.setValue(s.defaultOpenSubSideNav);
    }

    onGeneralTabSubmit() {
        const s: Settings = {...this.settings};
        s.defaultOpenHelpNav = this.formControlDefaultOpenHelpNav.value;
        s.defaultOpenSideNav = this.formControlDefaultOpenSideNav.value;
        s.defaultOpenSubSideNav = this.formControlDefaultOpenSubSideNav.value;
        this.events.emit({
            settings: s
        } as SettingsComponentEvent);
    }
}
