
export interface ForumUser {
   id: number;
   name: string;
}

export interface Forum {
   id: number;
   title: string;
   description: string;
   creator: ForumUser;
   creationDate: Date;
}

export interface Topic {
   id: number;
   forumId: number;
   title: string;
   description: string;
   creator: ForumUser;
   creationDate: Date;
}

export interface Comment {
   id: number;
   topicId: number;
   message: string;
   creator: ForumUser;
   creationDate: Date;
}

