import {Request, Response, NextFunction} from "express";
import {validationResult} from 'express-validator';
import {e, i} from "../../logger";
import {makeApiError, makeApiErrorObj} from "../../util";
import {decodeJwtToken, verifyJwtToken} from "../../service";
import {JwtPayload} from '@fuyuko-common/model/jwt.model';
import {
    getThreadLocalStore,
    setThreadLocalStore,
    threadLocalInit,
    ThreadLocalStore,
    hasAllUserRoles, hasAnyUserRoles, hasNoneUserRoles,
    fireEvent, IncomingHttpEvent
} from '../../service';
import {v4 as uuid} from 'uuid';



//////////////////////////////////////////////////////////////////////////////// --- start role validation functions

export interface ValidateFn {
    (req: Request, res: Response, msg: string[]): Promise<boolean>;
}

export interface AggregationFn {
    (vFns: ValidateFn[], req: Request, res: Response, msg: string[]): Promise<boolean>;
}

export const aFnAllTrue: AggregationFn = async (vFns: ValidateFn[], req: Request, res: Response, msg: string[]): Promise<boolean> => {
    let r = true;
    for (const vFn of vFns) {
        r = r && await vFn(req, res, msg);
    }
    return r;
}

export const aFnAllFalse: AggregationFn = async (vFns: ValidateFn[], req: Request, res: Response, msg: string[]): Promise<boolean> => {
    let r = false;
    for (const vFn of vFns) {
        r = r || await vFn(req, res, msg);
    }
    return !r;
}

export const aFnAnyTrue: AggregationFn = async (vFns: ValidateFn[], req: Request, res: Response, msg: string[]): Promise<boolean> => {
    for (const vFn of vFns) {
        const r = await vFn(req, res, msg);
        if (r) {
            return true;
        }
    }
    return false;
}

export const aFnAnyFalse: AggregationFn = async (vFns: ValidateFn[], req: Request, res: Response, msg: string[]): Promise<boolean> => {
    for (const vFn of vFns) {
        const r = await vFn(req, res, msg);
        if (!r) {
            return true;
        }
    }
    return false;
}

export const vFnHasAnyUserRoles  = (roleNames: string[]): ValidateFn => {
    return async (req: Request, res: Response) => {
        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;
        const hasRole: boolean = await hasAnyUserRoles(userId, roleNames);
        if (!hasRole) {
            return false;
        }
        return true;
    }
}

export const vFnHasAllUserRoles = (roleNames: string[]): ValidateFn => {
    return async (req: Request, res: Response, msg: string[]) => {
        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;
        const hasAllRole: boolean = await hasAllUserRoles(userId, roleNames);
        return hasAllRole;
    }
}

export const vFnHasNoneUserRoles = (roleNames: string[]): ValidateFn => {
    return async (req: Request, res: Response) => {
        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;
        const hasNoneRole: boolean = await hasNoneUserRoles(userId, roleNames);
        return hasNoneRole;
    }
}

export const vFnIsSelf = (uId: number): ValidateFn => {
    return async (req: Request, res: Response, msg: string[]) => {
        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;
        return (userId === uId);
    }
}

export const v = (vFns: ValidateFn[], aFn: AggregationFn) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const msg: string[] = [];
        const r: boolean = await aFn(vFns, req, res, msg);
        if (r) {
            //  ok
            next();
        } else {
            res.status(403).json(
                makeApiErrorObj(
                    makeApiError(
                        msg.join(', '),
                        '', 'Security insufficient priviledge(s)')
                )
            );
         }
    }
}

//////////////////////////////////////////////////////////////////////////////// --- end role validation functions


export const getJwtPayload = (res: Response): JwtPayload => {
   return res.locals.jwtPayload;
}

export const threadLocalMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    threadLocalInit((ns) => {
        try {
            const reqUuid = uuid();
            const jwtToken: string = req.headers['x-auth-jwt'] as string;
            if (jwtToken) {
                try {
                    const jwtPayload: JwtPayload = decodeJwtToken(jwtToken);
                    setThreadLocalStore({
                        reqUuid,
                        jwtPayload
                    } as ThreadLocalStore);
                } catch (err) {
                    e(`Error setting thread local`, err);
                }
            } else {
                setThreadLocalStore({
                    reqUuid,
                    jwtPayload: undefined
                });
            }
        } finally {
            const threadLocalStore: ThreadLocalStore = getThreadLocalStore();
            next();
        }
    });
};


export const auditMiddlewareFn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        fireEvent({
            type: "IncomingHttpEvent",
            req
        } as IncomingHttpEvent);
    } finally {
        next();
    }
};

export const timingLogMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime();
    const httpMethod = req.method;
    const url = req.url;

    res.on('finish', () => {
        const elapsedTime = process.hrtime(startTime);
        const diffInMilliSecs = ((elapsedTime[0] * 1000) + (elapsedTime[1] * 1e-6));

        const s = res.statusCode;
        // i(`Profiling Request ${httpMethod}-${url} Response ${s} : ${sprintf('%.3s ms', diffInMilliSecs)}`);
        i(`Profiling Request ${httpMethod}-${url} Response ${s} : ${diffInMilliSecs.toFixed(3)}ms`);
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
        res.status(400).json(makeApiErrorObj(...errors.array()))
    } else {
        next();
    }
};

type JwtErrorType = {
    name: string;
    message: string;
    expireDate: number;
}


export class ClientError extends Error {
    constructor(msg: string) {
        super(msg);
    }
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
    let errorStatus = 500;
    let errorLocation = `Server Error`;
    let errorMessage = `Unexpected Error: ${err.toString()}`;
    if (err instanceof ClientError) {
        e('Client Error', err);
        errorStatus = 400;
        errorLocation = `Client Error`;
        errorMessage = `Client Error: ${err.toString()}`;
    } else {
        e('Unexpected Error', err);
    }
    if (res.headersSent) {
        return next(err);
    }
    res.status(errorStatus).json(
        makeApiErrorObj(
            makeApiError(errorMessage, '', '', errorLocation)
        )
    );
};
