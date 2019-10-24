import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    templateUrl: './all-topics-in-forum.page.html',
    styleUrls: ['./all-topics-in-forum.page.scss']
})
export class AllTopicsInForumPageComponent implements OnInit {

    forumId: number;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.forumId = this.route.snapshot.params.forumId;
    }

}
