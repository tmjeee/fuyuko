import {NextFunction, Request, Response} from "express";
import {validationResult} from 'express-validator';
import {e, i} from "../../logger";
import {makeApiError, makeApiErrorObj} from "../../util";
import {verifyJwtToken } from "../../service";
import {JwtPayload} from "../../model/jwt.model";
import {hasAnyUserRoles, hasNoneUserRoles} from "../../service/user.service";

const validateRoleMiddlewareFn = (roleNames: string[],
                                  fn: (userId: number, roleNames: string[]) => Promise<boolean>,
                                  errFn: (req: Request) => string) => {
    return (async (req: Request, res: Response, next: NextFunction) => {
        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;
        const hasRole: boolean = await fn(userId, roleNames);
        if (!hasRole) {
            res.status(403).json(
                makeApiErrorObj(
                    makeApiError(
                        errFn(req),
                        'roleNames', roleNames.join(','), 'Security')
                )
            );
            return;
        }
        next();
    });
}

export const validateUserInAnyRoleMiddlewareFn = (roleNames: string[]) => {
    return validateRoleMiddlewareFn(roleNames,
        async (userId: number, roleNames: string[]): Promise<boolean> => await hasAnyUserRoles(userId, roleNames),
        (req: Request) => `Unauthorized: Require role ${roleNames.join(',')} to perform ${req.method} ${req.url}`);
}

export const validateUserInNoneOfRolesMiddlewareF = (roleNames: string[]) => {
    return validateRoleMiddlewareFn(roleNames,
        async (userId: number, roleNames: string[]): Promise<boolean> => await hasNoneUserRoles(userId, roleNames),
        (req: Request) => `Unauthorized: Require roles to not present ${roleNames.join(',')} to perform ${req.method} ${req.url}`);
}

export const getJwtPayload = (res: Response): JwtPayload => {
   return res.locals.jwtPayload;
}

export const timingLogMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime();
    const httpMethod = req.method;
    const url = req.url;

    res.on('finish', () => {
        const elapsedTime = process.hrtime(startTime);
        const diffInMilliSecs = ((elapsedTime[0] * 1000) + (elapsedTime[1] * 1e-6));

        const s = res.statusCode;
        i(`Profiling Request ${httpMethod}-${url} Response ${s} : ${diffInMilliSecs}ms`);
    });
    next();
}

export const httpLogMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const httpMethod = req.method;
    const url = req.url;
    i(`Incoming HTTP request: ${httpMethod} - ${url}`);
    next();
};

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
    const jwtToken: string = req.headers['x-auth-jwt'] as string;
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

export const catchErrorMiddlewareFn = async (err: any, req: Request, res: Response, next: NextFunction) => {
       e('Unexpected Error', err);
       if (res.headersSent) {
           return next(err);
       }
       res.status(500).json(
           makeApiErrorObj(
               makeApiError(`Unexpected Error: ${err.toString()}`, '', '', 'error')
           )
       );
};
