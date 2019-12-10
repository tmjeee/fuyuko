import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";

(async () => {
    await doInDbConnection(async (conn: PoolConnection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME FROM TBL_VIEW WHERE ID IN ?`, [[1,2,3,4]]);

        for (const i of q) {
            console.log(`${i.ID} - ${i.NAME}`);
        }
    });
})();
