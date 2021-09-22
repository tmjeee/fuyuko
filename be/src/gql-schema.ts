import {buildSchemaSync} from "type-graphql";
import {GraphQLUpload, Upload} from "graphql-upload";
import {Container} from "typedi";
import {resolvers as versionResolvers} from './gql/resolver/version.resolver';
import {resolvers as deleteCategoryResolvers} from './gql/resolver/delete-category.resolver';


export const buildAppSchema = () => {
    return buildSchemaSync({
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
            ...versionResolvers(),
            ...deleteCategoryResolvers(),
        ],
        orphanedTypes: [
        ]
    })

}
