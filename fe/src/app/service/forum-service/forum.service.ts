import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Forum, ForumUser, Topic, Comment} from '../../model/forum.model';

const ALL_FORUMS: Forum[] = [
 { id: 1, title: 'Forum #1', description: 'Forum #1 Description',  creationDate: new Date(), creator: { id: 1, name: 'tmjee1' } } as Forum,
 { id: 2, title: 'Forum #2', description: 'Forum #2 Description',  creationDate: new Date(), creator: { id: 2, name: 'tmjee2' } } as Forum,
 { id: 3, title: 'Forum #3', description: 'Forum #3 Description',  creationDate: new Date(), creator: { id: 3, name: 'tmjee3' } } as Forum,
 { id: 4, title: 'Forum #4', description: 'Forum #4 Description',  creationDate: new Date(), creator: { id: 4, name: 'tmjee4' } } as Forum,
 { id: 5, title: 'Forum #5', description: 'Forum #5 Description',  creationDate: new Date(), creator: { id: 5, name: 'tmjee5' } } as Forum,
];

@Injectable()
export class ForumService {

    allForums(): Observable<Forum[]> {
        return of([...ALL_FORUMS]);
    }

    getForum(forumId: number): Observable<Forum> {
        const ff: Forum =  ALL_FORUMS.find((f: Forum) => (f.id === forumId));
        return of(ff);
    }


    allTopics(forumId: number): Observable<Topic[]> {
        return of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i: number) => {
            return {
                id: i,
                title: `Topic ${i} ${new Date()}`,
                description: `Topic ${i} description ${new Date()}`,
                forumId,
                creationDate: new Date(),
                creator: {
                    id: 1,
                    name: 'tmjee1'
                } as ForumUser
            } as Topic;
        }));
    }

    topicAndComments(forumId: number, topicId: number): Observable<{topic: Topic, comments: Comment[]}> {
        return of({
            topic: {
                id: topicId,
                title: `Topic ${topicId} ${new Date()}`,
                forumId,
                creationDate: new Date(),
                creator: {
                   id: 1,
                   name: 'tmjee1',
                } as ForumUser
            } as Topic,
            comments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x: number) => {
                return {
                    id: x,
                    topicId,
                    creator: {
                        id: 2,
                        name: 'tmjee2'
                    } as ForumUser,
                    creationDate: new Date(),
                    message: `Message ${x} for Topic ${topicId} in forum ${forumId}`
                } as Comment;
            })
        });
    }
}
