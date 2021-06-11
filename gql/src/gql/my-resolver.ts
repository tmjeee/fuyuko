import {Query, Resolver} from "type-graphql";
import {MyDomain} from "./my-domain";


@Resolver(MyDomain)
export class MyResolver {

    @Query(returns => [MyDomain])
    async myDomains(): Promise<MyDomain[]> {
        return [{id: '1'}, {id: '2'}];
    }

}

