import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-remove-custom-rule-from-view.route';

@InputType()
export class DeleteCustomRuleFromViewInput {
   @Field() viewId!: number;
   @Field(_ => [Int]) customRuleIds!: number[];
}

@ObjectType()
export class DeleteCustomRuleFromViewOutputPayload {
}

@ObjectType()
export class DeleteCustomRuleFromViewOutput extends createGqlResponseClass(DeleteCustomRuleFromViewOutputPayload) {
}


@Service()
@Resolver()
export class DeleteRemoveCustomRuleFromViewResolver {

    @Mutation()
    async deleteCustomRuleFromView(@Arg('input') input: DeleteCustomRuleFromViewInput): Promise<DeleteCustomRuleFromViewOutput> {
        const apiResponse = await invocation(input.viewId, input.customRuleIds);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }

}
