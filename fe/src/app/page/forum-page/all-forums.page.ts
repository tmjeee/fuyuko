import {Component, OnInit} from '@angular/core';
import {ForumService} from '../../service/forum-service/forum.service';
import {Forum} from '../../model/forum.model';
import {tap} from 'rxjs/operators';
import {ForumListingsComponentEvent} from '../../component/forum-component/forums-listings.component';
import {Router} from '@angular/router';


@Component({
    templateUrl: './all-forums.page.html',
    styleUrls: ['./all-forums.page.scss']
})
export class AllForumsPageComponent implements OnInit {

    ready: boolean;
    forums: Forum[];

    constructor(private forumService: ForumService,
                private router: Router) {}


    ngOnInit(): void {
        this.ready = false;
        this.forumService.allForums().pipe(
            tap((f: Forum[]) => {
                this.forums = f;
                this.ready = true;
            })
        ).subscribe();
    }

    onForumEvent($event: ForumListingsComponentEvent) {
        this.router.navigate(['help-center-gen-layout', 'forum', $event.forumId]);
    }
}
