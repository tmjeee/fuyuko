import {Router, Request, Response, NextFunction} from 'express';
import {validateMiddlewareFn} from './common-middleware';
import {Registry} from '../../registry';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {logout} from '../../service';
import {User} from '@fuyuko-common/model/user.model';
import {decodeJwtToken} from '../../service';
import {JwtPayload} from '@fuyuko-common/model/jwt.model';

// CHECKED

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        let user: User = null;
        const jwtToken: string = req.headers['x-auth-jwt'] as string;
        if (jwtToken) {
            const jwtPayload: JwtPayload = decodeJwtToken(jwtToken);
            user = jwtPayload.user;
        }
        await logout(user);
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: 'Logged out, have a nice day'
            }]
        };
        res.status(200).json(apiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = '/logout';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
