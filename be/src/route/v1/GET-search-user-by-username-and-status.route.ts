import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from './common-middleware';
import {param} from 'express-validator';
import {doInDbConnection} from '../../db';
import {Connection} from 'mariadb';
import {User} from '@fuyuko-common/model/user.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {searchUserByUsernameAndStatus} from '../../service';

// CHECKED
export const httpAction: any[] = [
    [
        param('status').exists(),
        param('username'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        await doInDbConnection(async (conn: Connection) => {

            const status: string = req.params.status;
            const username: string = req.params.username;

            const u: User[] = await searchUserByUsernameAndStatus(status, username);

            res.status(200).json({
                status: 'SUCCESS',
                message: `Users retrieved`,
                payload: u
            } as ApiResponse<User[]>);

        });
    }
];

export const reg = (router: Router, registry: Registry) => {
    const p = `/search/status/:status/user/:username?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;