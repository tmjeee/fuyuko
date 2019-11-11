import {Router, Request, Response, NextFunction} from "express";
import {check} from "express-validator";
import {validateMiddlewareFn} from "./common-middleware";

import * as jwt from 'jsonwebtoken';

const loginHttpAction = [
    [
        check('username').isLength({min: 1}),
        check('password').isLength({min:1})
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const username: string = req.body.username;
        const password: string = req.body.password;

        // jwt.sign({});



    }
];

const reg = (router: Router) => {
    router.post('/login', ...loginHttpAction) ;
}

export default reg;
