import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {check, body} from 'express-validator';
import {
    aFnAnyTrue,
    getJwtPayload, v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {JwtPayload} from "../../model/jwt.model";
import {getUserById, hashedPassword} from "../../service";
import {User} from "../../model/user.model";
import {ROLE_EDIT} from "../../model/role.model";
import {QueryA} from "../../db/db";
import {ApiResponse} from "../../model/api-response.model";
import {updateUser} from "../../service/user.service";

// CHECKED

const httpAction: any[] = [
    [
        body('userId').exists(),
        body('firstName'),
        body('lastName'),
        body('email'),
        body('theme'),
        body('password'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const theme = req.body.theme;
        const password = req.body.password;

        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;

        const errors: string[] = await updateUser({userId, firstName, lastName, email, theme, password});
        const user: User = await getUserById(userId);

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', '),
                payload: user
            } as ApiResponse<User>);

        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `User saved`,
                payload: user
            } as ApiResponse<User>);
        }
    }
];

const reg = (router: Router, registry: Registry) =>{
    const p = '/user';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
