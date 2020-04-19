import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {Registry} from "../../registry";
import {ApiResponse} from "../../model/api-response.model";
import {logout} from "../../service/auth.service";
import {User} from "../../model/user.model";
import {verifyJwtToken} from "../../service";
import {JwtPayload} from "../../model/jwt.model";

// CHECKED

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        let user: User = null;
        const jwtToken: string = req.headers['x-auth-jwt'] as string;
        if (jwtToken) {
            const jwtPayload: JwtPayload = verifyJwtToken(jwtToken);
            user = jwtPayload.user;
        }
        await logout(user);
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Logged out, have a nice day'
        } as ApiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = '/logout';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
