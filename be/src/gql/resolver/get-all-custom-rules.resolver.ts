import {Service} from "typedi";
import {Field, ObjectType, Query, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/GET-all-custom-rules.route';
import {CustomRule} from "@fuyuko-common/model/custom-rule.model";
import {GqlCustomRule} from "../custom-types/common-gql-classes";

@ObjectType()
export class GetAllCustomRulesOutputPayload {
   @Field(_ => GqlCustomRule) customRules!: CustomRule[];
}

@ObjectType()
export class GetAllCustomRulesOutput extends createGqlResponseClass(GetAllCustomRulesOutputPayload){
}

@Service()
@Resolver()
export class GetAllCustomRulesResolver {

    @Query(_ => GetAllCustomRulesOutput)
    async getAllCustomRules(): Promise<GetAllCustomRulesOutput> {
       const apiResponse = await invocation();
       return {
           messages: apiResponse.messages,
           payload: {
              customRules: apiResponse.payload ?? []
           }
       }
    }
}
