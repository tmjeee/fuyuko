"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const type_graphql_1 = require("type-graphql");
const my_resolver_1 = require("./gql/my-resolver");
const port = 7777;
const app = express_1.default();
const schema = type_graphql_1.buildSchemaSync({
    resolvers: [
        my_resolver_1.MyResolver,
    ]
});
app.use('/gql', express_graphql_1.graphqlHTTP((req, res, graphqlParams) => {
    return {
        schema,
        graphiql: true,
        context: {
            req, res, graphqlParams,
        }
    };
}));
app.listen(port, () => {
    console.log(`*** GraphQL API started at ${port}`);
});
