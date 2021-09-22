import {moduleAlias} from 'module-alias';
import 'module-alias/register';   // module-alias for @fuyuko-*
import {buildAppSchema} from "./gql-schema";

buildAppSchema();
