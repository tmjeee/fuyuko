import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit, Renderer2,
    SimpleChange,
    SimpleChanges,
    ViewContainerRef
} from "@angular/core";


@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnChanges, OnInit {

    @Input() show: boolean;

    constructor(private s: ViewContainerRef, private e: ElementRef, private r: Renderer2 ) {
    }

    ngOnInit(): void {
        (this.e.nativeElement as HTMLElement).parentElement.removeChild(this.e.nativeElement)
        document.querySelector(`.app`).appendChild(this.e.nativeElement);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const change: SimpleChange  = changes.show;
        if (change !== null && change !== undefined) {
        }
    }
}