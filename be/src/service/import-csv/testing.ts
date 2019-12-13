import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";
import {readPair1Csv} from "./import-csv.service";

(async () => {
    const p = `key1=value1|key2=value2|key3=value3`;
    const s = await readPair1Csv(p);
    console.log(s);
})();
