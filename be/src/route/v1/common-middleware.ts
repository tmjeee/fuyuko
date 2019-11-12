import {NextFunction, Request, Response} from "express";
import {validationResult, ValidationError} from 'express-validator';
import {e} from "../../logger";
import {makeApiError, makeApiErrorObj} from "../../util";
import {verifyJwtToken } from "../../service";
import {JwtPayload} from "../../model/jwt.model";

export const validateMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const errors  = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
    } else {
        next();
    }
};

type JwtErrorType = {
    name: string;
    message: string;
    expireDate: number;
}


export const validateJwtMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const jwtToken: string = req.headers['X-AUTH-JWT'] as string;
    if (!jwtToken) {
        res.status(401).json(makeApiErrorObj(
            makeApiError(`Missing jwt token`, 'jwt', '', 'Security')
        ));
        return;
    }
    try {
        const jwtPayload: JwtPayload = verifyJwtToken(jwtToken);
        res.locals.jwtPayload = jwtPayload;
        next();
    } catch(err ) {
        const jwtError: JwtErrorType = err;
        res.status(401).json(makeApiErrorObj(
            makeApiError(`${jwtError.name} ${jwtError.message}`, 'jwtToken', '', 'Security')
        ));
    }
};

export const catchErrorMiddlewareFn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('before &&&&&&&&&&&&&&&&&&&&&&&& ');
        await next();
        console.log('after &&&&&&&&&&&&&&&&&&&&&&&& ');
    } catch (err) {
       e('Unexpected Error', err);
       res.status(500).json({
           errors: [
               {
                   value: "",
                   msg: `Unexpected Error: ${err.toString()}`,
                   param: "",
                   location: "system"
               }
           ]
       });
    }
};