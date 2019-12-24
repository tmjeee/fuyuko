import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
let AllPostsInTopicPageComponent = class AllPostsInTopicPageComponent {
    constructor(route) {
        this.route = route;
    }
    ngOnInit() {
        this.forumId = this.route.snapshot.params.forumId;
        this.topicId = this.route.snapshot.params.topicId;
    }
};
AllPostsInTopicPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './all-posts-in-topic.page.html',
        styleUrls: ['./all-posts-in-topic.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ActivatedRoute])
], AllPostsInTopicPageComponent);
export { AllPostsInTopicPageComponent };
//# sourceMappingURL=all-posts-in-topic.page.js.map