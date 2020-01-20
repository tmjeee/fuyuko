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
            { id: validation.id },
            { name: validation.name},
            { description: validation.description },
            { viewId: validation.viewId },
            { progress: validation.progress },
            { lastUpdate: validation.lastUpdate },
            { creationDate: validation.creationDate }
        ];
    }

    async details($event: MouseEvent, validation: Validation) {
        await this.router.navigate([{outlets: {
            primary: ['/view-gen-layout', 'view', this.view.id, 'validation', validation.id],
            help: ['view-help']
        }}]);
    }
}
