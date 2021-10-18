import {MiddlewareInterface, NextFn, ResolverData} from "type-graphql";
import {GqlContext} from "../../app";


export class ValidateJwtMiddleware implements MiddlewareInterface<GqlContext> {

    use(action: ResolverData<GqlContext>, next: NextFn): Promise<any> {
        return Promise.resolve(undefined);
    }

}
