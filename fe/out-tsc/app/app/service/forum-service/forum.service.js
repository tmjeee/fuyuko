import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
const ALL_FORUMS = [
    { id: 1, title: 'Forum #1', description: 'Forum #1 Description', creationDate: new Date(), creator: { id: 1, name: 'tmjee1' } },
    { id: 2, title: 'Forum #2', description: 'Forum #2 Description', creationDate: new Date(), creator: { id: 2, name: 'tmjee2' } },
    { id: 3, title: 'Forum #3', description: 'Forum #3 Description', creationDate: new Date(), creator: { id: 3, name: 'tmjee3' } },
    { id: 4, title: 'Forum #4', description: 'Forum #4 Description', creationDate: new Date(), creator: { id: 4, name: 'tmjee4' } },
    { id: 5, title: 'Forum #5', description: 'Forum #5 Description', creationDate: new Date(), creator: { id: 5, name: 'tmjee5' } },
];
let ForumService = class ForumService {
    allForums() {
        return of([...ALL_FORUMS]);
    }
    getForum(forumId) {
        const ff = ALL_FORUMS.find((f) => (f.id === forumId));
        return of(ff);
    }
    allTopics(forumId) {
        return of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            return {
                id: i,
                title: `Topic ${i} ${new Date()}`,
                description: `Topic ${i} description ${new Date()}`,
                forumId,
                creationDate: new Date(),
                creator: {
                    id: 1,
                    name: 'tmjee1'
                }
            };
        }));
    }
    topicAndComments(forumId, topicId) {
        return of({
            topic: {
                id: topicId,
                title: `Topic ${topicId} ${new Date()}`,
                forumId,
                creationDate: new Date(),
                creator: {
                    id: 1,
                    name: 'tmjee1',
                }
            },
            comments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => {
                return {
                    id: x,
                    topicId,
                    creator: {
                        id: 2,
                        name: 'tmjee2'
                    },
                    creationDate: new Date(),
                    message: `Message ${x} for Topic ${topicId} in forum ${forumId}`
                };
            })
        });
    }
};
ForumService = tslib_1.__decorate([
    Injectable()
], ForumService);
export { ForumService };
//# sourceMappingURL=forum.service.js.map