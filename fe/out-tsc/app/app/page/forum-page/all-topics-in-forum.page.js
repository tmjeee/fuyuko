import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../../service/forum-service/forum.service';
import { tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
let AllTopicsInForumPageComponent = class AllTopicsInForumPageComponent {
    constructor(route, forumService) {
        this.route = route;
        this.forumService = forumService;
    }
    ngOnInit() {
        this.loading = true;
        this.forumId = Number(this.route.snapshot.params.forumId);
        forkJoin({
            forum: this.forumService.getForum(this.forumId),
            topics: this.forumService.allTopics(this.forumId)
        }).pipe(tap((r) => {
            this.forum = r.forum;
            this.topics = r.topics;
            this.loading = false;
        })).subscribe();
    }
};
AllTopicsInForumPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './all-topics-in-forum.page.html',
        styleUrls: ['./all-topics-in-forum.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
        ForumService])
], AllTopicsInForumPageComponent);
export { AllTopicsInForumPageComponent };
//# sourceMappingURL=all-topics-in-forum.page.js.map