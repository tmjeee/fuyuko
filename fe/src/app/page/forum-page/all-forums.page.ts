import {Component, OnInit} from '@angular/core';
import {ForumService} from '../../service/forum-service/forum.service';
import {Forum} from '../../model/forum.model';
import {tap} from 'rxjs/operators';


@Component({
    templateUrl: './all-forums.page.html',
    styleUrls: ['./all-forums.page.scss']
})
export class AllForumsPageComponent implements OnInit {

    ready: boolean;
    forums: Forum[];

    constructor(private forumService: ForumService) {}


    ngOnInit(): void {
        this.ready = false;
        this.forumService.allForums().pipe(
            tap((f: Forum[]) => {
                this.forums = f;
                this.ready = true;
            })
        ).subscribe();
    }

}
