import 'reflect-metadata';
import {Service} from "typedi";
import {NonEmptyArray, ObjectType, Query, Resolver, Field, UseMiddleware} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";


@ObjectType()
export class VersionOutputPayload {
    @Field() test: string;
}

@ObjectType()
export class VersionOutput extends createGqlResponseClass(VersionOutputPayload){}

@Service()
@Resolver()
export class VersionResolver {

    @Query(_ => VersionOutput)
    @UseMiddleware([])
    async version(): Promise<VersionOutput> {
        return new VersionOutput();
    }

}
