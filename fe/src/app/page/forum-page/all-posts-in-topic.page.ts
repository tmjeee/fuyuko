import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
   templateUrl: './all-posts-in-topic.page.html',
   styleUrls: ['./all-posts-in-topic.page.scss']
})
export class AllPostsInTopicPageComponent implements OnInit {

   forumId: number;
   topicId: number;

   constructor(private route: ActivatedRoute) { }

   ngOnInit(): void {
      this.forumId = this.route.snapshot.params.forumId;
      this.topicId = this.route.snapshot.params.topicId;
   }






}