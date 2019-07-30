import {Component, EventEmitter, Input, Output} from '@angular/core';
import {View} from '../../model/view.model';
import {MatDialog} from '@angular/material';
import {ViewEditorDialogComponent} from './view-editor-dialog.component';
import {tap} from 'rxjs/operators';

export type Type = 'name' | 'description' | 'all';

export interface ViewEditorComponentEvent {
    view: View;
    type: Type;
}

@Component({
    selector: 'app-view-editor',
    templateUrl: './view-editor.component.html',
    styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent {

    @Input() view: View;
    @Input() type: Type;

    @Output() events: EventEmitter<ViewEditorComponentEvent>;

    constructor(private matDialog: MatDialog) {
        this.events = new EventEmitter();
    }

    onEdit($event: MouseEvent, description: string) {
        this.matDialog.open(ViewEditorDialogComponent, {
            data: {...{view: this.view, type: this.type}}
        })
        .afterClosed()
        .pipe(
            tap((r: View) => {
                if (r) {
                    switch (this.type) {
                        case 'name':
                            this.view.name = r.name;
                            break;
                        case 'description':
                            this.view.description = r.description;
                            break;
                        case 'all':
                            this.view.name = r.name;
                            this.view.description = r.description;
                            break;
                    }
                    this.events.emit({
                        view: this.view,
                        type: this.type} as ViewEditorComponentEvent);
                }
            })
        ).subscribe();
    }
}
