import {
    Component,
    ElementRef,
    Input,
    OnChanges, OnDestroy,
    OnInit, Renderer2,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';
import {LoadingService} from '../../../service/loading-service/loading.service';
import {Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';


@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnChanges, OnInit, OnDestroy {

    @Input() show = false;

    subscription?: Subscription;

    constructor(private s: ViewContainerRef, private e: ElementRef, private r: Renderer2, private loadingService: LoadingService) {
    }

    ngOnInit(): void {
        const e: HTMLElement = this.e.nativeElement as HTMLElement;
        if (e.parentElement) {
            e.parentElement.removeChild(this.e.nativeElement);
        }
        document.querySelector(`.app`)?.appendChild(this.e.nativeElement);
        this.subscription = this.loadingService.asObservable().pipe(
            tap((r: boolean) => {
                if (r !== undefined && r !== null) {
                    this.show = r;
                }
            })
        ).subscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
