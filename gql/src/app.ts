import 'reflect-metadata';
import express from 'express';
import { graphqlHTTP,  } from 'express-graphql';
import { buildSchemaSync } from "type-graphql";
import {MyResolver} from "./gql/my-resolver";

const port = 7777;

const app = express();

const schema: any = buildSchemaSync({
    emitSchemaFile: {
        path: './dist/gql/gql-schema',
        sortedSchema: true,
        commentDescriptions: true
    },
    resolvers: [
        MyResolver,
    ],
    dateScalarMode: 'isoDate',
});

app.use(
    '/gql',
    graphqlHTTP((req, res, graphqlParams) => {
        return {
            schema,
            graphiql: true,
            context: {
                req, res, graphqlParams,
            }
        }
    })
);

app.listen(port, () => {
  console.log(`*** GraphQL API started at port ${port} ***`);
});


