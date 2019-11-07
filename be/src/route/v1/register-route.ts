

import v1AppRouter from './v1-app-router';
import {Request, Response, NextFunction, Router} from 'express';
import {check} from 'express-validator/check';

import {register} from '../../service/register-service';
import {QueryResponse} from "../../db";
import {Registration} from "../../model/registration.model";
import {catchErrorMiddlewareFn, validateMiddlewareFn} from "./common-middleware";

import util from 'util';

const testHttpAction = (req: Request, res: Response, next: NextFunction) => {
    console.log('**************** get test');
    res.json('{}');
};

const registerHttpAction = [
    catchErrorMiddlewareFn,
    [
        check('username').isLength({min:1}),
        check('email').isLength({min:1}).isEmail(),
        check('password').isLength({min:1})
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username
        const email: string = req.body.email;
        const password: string = req.body.password;

        const r: Registration = await register(username, email, password);

        res.status(200).json(r);
    }
];

const reg = (router: Router) => {
    router.get('/test', testHttpAction);
    router.post('/register', ...registerHttpAction);
};

export default reg;