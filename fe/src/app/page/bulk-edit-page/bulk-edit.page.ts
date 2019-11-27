import {Component, OnDestroy, OnInit} from '@angular/core';
import {Attribute} from '../../model/attribute.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '../../model/view.model';
import {map} from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import {Subscription} from 'rxjs';


@Component({
  templateUrl: './bulk-edit.page.html',
  styleUrls: ['./bulk-edit.page.scss']
})
export class BulkEditPageComponent implements OnInit, OnDestroy {

  attributes: Attribute[];
  allViews: View[];

  currentView: View;
  subscription: Subscription;

  constructor(private viewService: ViewService, private attributeService: AttributeService) {}

  ngOnInit(): void {
      this.viewService.getAllViews()
          .pipe(
            map((v: View[]) => {
                this.allViews = v;
            }),
            map(() => {
                this.subscription = this.viewService.asObserver()
                    .pipe(
                        map((v: View) => {
                            if (v) {
                                this.currentView = this.allViews ? this.allViews.find((vv: View) => vv.id === v.id) : undefined;
                                this.subscription = this.attributeService.getAllAttributesByView(this.currentView.id)
                                    .pipe(
                                        map((a: Attribute[]) => {
                                            this.attributes = a;
                                        })
                                    ).subscribe();
                            }
                        }),
                    ).subscribe();
            })
          ).subscribe();
  }

    onViewSelectionChanged($event: MatSelectChange) {
        const view: View = $event.value;
        this.viewService.setCurrentView(view);
    }

    ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription .unsubscribe();
      }
    }
}
