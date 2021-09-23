import moduleAlias from 'module-alias';
import 'module-alias/register';   // module-alias for @fuyuko-*
import {buildAppSchema} from "./gql-schema";

((async () => {
    console.log('start building app gql schema');
    const r = await buildAppSchema();
    console.log(r);
    console.log('done');
    process.exit();
})());
