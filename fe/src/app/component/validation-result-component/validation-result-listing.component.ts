import {Component, Input} from '@angular/core';
import {Validation} from '../../model/validation.model';
import {Router} from '@angular/router';
import {View} from '../../model/view.model';

@Component({
    selector: 'app-validation-result-listing',
    templateUrl: './validation-result-listing.component.html',
    styleUrls: ['./validation-result-listing.component.scss']
})
export class ValidationResultListingComponent {

    @Input() view: View;
    @Input() validations: Validation[];

    constructor(private router: Router) {}

    toDataSource(validation: Validation): {}[] {
        return [
            { key: 'id', value: validation.id },
            { key: 'name', value: validation.name},
            { key: 'description', value: validation.description },
            { key: 'viewId', value: validation.viewId },
            { key: 'progress', value: validation.progress },
            { key: 'lastUpdate', value: validation.lastUpdate },
            { key: 'creationDate', value: validation.creationDate }
        ];
    }

    async details($event: MouseEvent, validation: Validation) {
        $event.preventDefault();
        $event.stopImmediatePropagation();
        console.log(this.view);
        console.log(validation);
        await this.router.navigate(['/view-gen-layout', {outlets: {
            primary: ['validation-details', 'view', this.view.id, 'validation', validation.id],
            // help: ['view-help']
        }}]);
    }
}
