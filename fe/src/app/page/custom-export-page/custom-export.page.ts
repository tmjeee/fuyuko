import {Component, OnDestroy, OnInit} from "@angular/core";
import {ViewService} from "../../service/view-service/view.service";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {map} from "rxjs/operators";
import {View} from "../../model/view.model";
import {Attribute} from "../../model/attribute.model";
import {Subscription} from "rxjs";
import {MatSelectChange} from "@angular/material/select";


@Component({
    templateUrl: './custom-export.page.html',
    styleUrls: ['./custom-export.page.scss']
})
export class CustomExportPageComponent implements OnInit, OnDestroy {


    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }



}