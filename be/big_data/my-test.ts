import {doInDbConnection, QueryA} from "../src/db";
import {Connection} from "mariadb";

const test = async () => {
   await doInDbConnection(async (conn: Connection) => {
      const q: QueryA = await conn.query(`
         SELECT 
            ID, NAME, DESCRIPTION 
         FROM TBL_ITEM 
         LIMIT ? OFFSET ? 
      `, [5, 0]);

      for (const i of q) {
         console.log(`** ${i.ID}, ${i.NAME}, ${i.DESCRIPTION}`);
      }
   });
};


(async function() {
   await test();
}());

