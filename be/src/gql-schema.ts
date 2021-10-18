import {buildSchemaSync, buildSchema} from "type-graphql";
import {GraphQLUpload, Upload} from "graphql-upload";
import {Container} from "typedi";
import {VersionResolver} from './gql/resolver/version.resolver';
import {DeleteCategoryResolver} from './gql/resolver/delete-category.resolver';
import {DeleteDataExportArtifactByIdResolver} from "./gql/resolver/delete-data-export-artifact-by-id.resolver";
import {DeleteFavouriteItemsResolver} from "./gql/resolver/delete-favourite-items.resolver";
import {DeleteGroupsResolver} from "./gql/resolver/delete-groups.resolver";
import {DeleteRemoveCustomRuleFromViewResolver} from "./gql/resolver/delete-remove-custom-rule-from-view.resolver";
import {DeleteItemFromCategoryResolver} from "./gql/resolver/delete-remove-item-from-category.resolver";
import {DeleteRoleFromGroupResolver} from "./gql/resolver/delete-role-from-group.resolver";
import {DeleteSelfRegistrationResolver} from "./gql/resolver/delete-self-registration.resolver";
import {DeleteUserByIdResolver} from "./gql/resolver/delete-user-by-id.resolver";
import {DeleteUserFromGroupResolver} from "./gql/resolver/delete-user-from-group.resolver";
import {DeleteValidationResultByIdResolver} from "./gql/resolver/delete-validation-result-by-id.resolver";
import {GetAllAttributesByViewResolver} from "./gql/resolver/get-all-attributes-by-view.resolver";
import {GetAllCustomBulkEditResolver} from "./gql/resolver/get-all-custom-bulk-edit.resolver";
import {DeleteViewsByIdResolver} from "./gql/resolver/delete-views-by-id.resolver";
import {GetAllCustomRulesResolver} from "./gql/resolver/get-all-custom-rules.resolver";
import {GetAllCustomRulesByViewResolver} from "./gql/resolver/get-all-custom-rules-by-view.resolver";
import {GetAllDataExportArtifactsResolver} from "./gql/resolver/get-all-data-export-artifacts.resolver";


export const buildAppSchema = () => {
    return buildSchema({
        scalarsMap: [
            {type: Upload, scalar: GraphQLUpload},
        ],
        emitSchemaFile: {
            commentDescriptions: true,
            sortedSchema: true,
            path: `${__dirname}/schema.gql`,
        },
        container: Container,
        globalMiddlewares: [],
        resolvers: [
            VersionResolver,
            DeleteCategoryResolver,
            DeleteDataExportArtifactByIdResolver,
            DeleteFavouriteItemsResolver,
            DeleteGroupsResolver,
            DeleteRemoveCustomRuleFromViewResolver,
            DeleteItemFromCategoryResolver,
            DeleteRoleFromGroupResolver,
            DeleteSelfRegistrationResolver,
            DeleteUserByIdResolver,
            DeleteUserFromGroupResolver,
            DeleteValidationResultByIdResolver,
            DeleteViewsByIdResolver,
            GetAllAttributesByViewResolver,
            GetAllCustomBulkEditResolver,
            GetAllCustomRulesResolver,
            GetAllCustomRulesByViewResolver,
            GetAllDataExportArtifactsResolver,
        ],
        orphanedTypes: [
        ]
    })

}
