import {buildSchemaSync, buildSchema} from "type-graphql";
import {GraphQLUpload, Upload} from "graphql-upload";
import {Container} from "typedi";
import {VersionResolver} from './gql/resolver/version.resolver';
import {DeleteCategoryResolver} from './gql/resolver/delete-category.resolver';


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
        ],
        orphanedTypes: [
        ]
    })

}
