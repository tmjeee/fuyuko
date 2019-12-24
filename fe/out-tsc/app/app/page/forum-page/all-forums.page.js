import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ForumService } from '../../service/forum-service/forum.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
let AllForumsPageComponent = class AllForumsPageComponent {
    constructor(forumService, router) {
        this.forumService = forumService;
        this.router = router;
    }
    ngOnInit() {
        this.ready = false;
        this.forumService.allForums().pipe(tap((f) => {
            this.forums = f;
            this.ready = true;
        })).subscribe();
    }
    onForumEvent($event) {
        this.router.navigate(['help-center-gen-layout', 'forum', $event.forumId]);
    }
};
AllForumsPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './all-forums.page.html',
        styleUrls: ['./all-forums.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ForumService,
        Router])
], AllForumsPageComponent);
export { AllForumsPageComponent };
//# sourceMappingURL=all-forums.page.js.map