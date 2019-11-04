import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ForumService} from '../../service/forum-service/forum.service';
import {tap} from 'rxjs/operators';
import {Forum, Topic} from '../../model/forum.model';
import {forkJoin} from 'rxjs';

@Component({
    templateUrl: './all-topics-in-forum.page.html',
    styleUrls: ['./all-topics-in-forum.page.scss']
})
export class AllTopicsInForumPageComponent implements OnInit {

    loading: boolean;
    forumId: number;

    forum: Forum;
    topics: Topic[];

    constructor(private route: ActivatedRoute,
                private forumService: ForumService) {}

    ngOnInit(): void {
        this.loading = true;
        this.forumId = Number(this.route.snapshot.params.forumId);
        forkJoin({
           forum: this.forumService.getForum(this.forumId),
           topics: this.forumService.allTopics(this.forumId)
        }).pipe(
            tap((r: {forum: Forum, topics: Topic[]}) => {
                this.forum = r.forum;
                this.topics = r.topics;
                this.loading = false;
            })
        ).subscribe();
    }

}
