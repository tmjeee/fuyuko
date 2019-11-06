

import {v1AppRouter} from './v1-app-router';
import {Request, Response, NextFunction} from 'express';
import {check} from 'express-validator/check';

import {register} from '../../service/register-service';
import {QueryResponse} from "../../db";

v1AppRouter.post('/register',
    [
        check('username').isLength({min:1}),
        check('email').isLength({min:1}).isEmail(),
        check('password').isLength({min:1})
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username
        const email: string = req.body.email;
        const password: string = req.body.password;

        const r: QueryResponse = await register(username, email, password);

    }
);