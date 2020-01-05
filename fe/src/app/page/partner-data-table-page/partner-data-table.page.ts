import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    templateUrl: './partner-data-table.page.html',
    styleUrls: ['./partner-data-table.page.scss']
})
export class PartnerDataTablePageComponent {

    constructor(private httpClient: HttpClient) {
    }

}
