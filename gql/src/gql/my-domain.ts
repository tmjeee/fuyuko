import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class MyDomain {

    @Field(type => ID)
    id: string | undefined;

}