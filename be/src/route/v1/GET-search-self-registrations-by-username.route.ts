import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {SelfRegistration} from "../../model/self-registration.model";

const httpAction: any[] = [
   [
      param('username').exists()
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   async (req: Request, res: Response, next: NextFunction) => {

      const username: string = req.params.username;

       const selfRegistrations: SelfRegistration[] = await doInDbConnection(async (conn: Connection) => {
          const q: QueryA = await conn.query(`
            SELECT 
               ID, 
               USERNAME,
               EMAIL,
               FIRSTNAME,
               LASTNAME,
               PASSWORD,
               CREATION_DATE,
               ACTIVATED 
            FROM TBL_SELF_REGISTRATION
            WHERE USERNAME LIKE ? AND ACTIVATED IS TRUE
          `, [`%${username}%`]);

          return q.reduce((a: SelfRegistration[], i: QueryI) => {
            const s: SelfRegistration = {
                id: i.ID,
                username: i.USERNAME,
                activated: i.ACTIVATED,
                creationDate: i.CREATION_DATE,
                lastName: i.LASTNAME,
                firstName: i.FIRSTNAME,
                email: i.EMAIL
            };
            a.push(s);
            return a;
          }, []);
       });

       res.status(200).json(selfRegistrations);
   }
];


export const reg = (router: Router, registry: Registry) => {
   const p = `/self-registration/:username`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
}


export default reg;
