import {Service} from "typedi";
import {Arg, Field, InputType, Int, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/GET-all-custom-rules-by-view.route'
import {createGqlResponseClass} from "../util/gql-utils";
import {CustomRule, CustomRuleForView} from "@fuyuko-common/model/custom-rule.model";
import {GqlCustomRuleForView} from "../custom-types/common-gql-classes";

@InputType()
export class GetAllCustomerRulesByViewInput {
    @Field(_ => Int) viewId!: number;
}

@ObjectType()
export class GetAllCustomerRulesByViewOutputPayload {
    @Field(_ => [GqlCustomRuleForView]) customRulesForView!: CustomRuleForView[]
}

@ObjectType()
export class GetAllCustomerRulesByViewOutput extends createGqlResponseClass(GetAllCustomerRulesByViewOutputPayload){
}


@Service()
@Resolver()
export class GetAllCustomRulesByViewResolver {

    async getAllCustomerRulesByView(@Arg('input') input: GetAllCustomerRulesByViewInput): Promise<GetAllCustomerRulesByViewOutput> {
       const apiResponse = await invocation(input.viewId);
       return {
           messages: apiResponse.messages,
           payload: {
               customRulesForView: apiResponse.payload ?? []
           }
       }
    }

}
