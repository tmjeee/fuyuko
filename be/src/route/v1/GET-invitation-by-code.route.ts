import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import { Invitation } from "../../model/invitation.model";
import {makeApiError, makeApiErrorObj} from "../../util";
import {Registry} from "../../registry";
import {ApiResponse} from "../../model/api-response.model";
import {getInvitationByCode} from "../../service/invitation.service";

// CHECKED

/**
 * Get invitation by code
 */
const httpAction = [
    [
        check('code').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const code: string = req.params.code;
        const invitation: Invitation = await getInvitationByCode(code);

        res.status(200).json({
            status: 'SUCCESS',
            message: `invitation retrieved successfully`,
            payload: invitation
        } as ApiResponse<Invitation>);
    }
]

const reg = (router: Router, registry: Registry) => {
   const p = '/invitations/:code';
   registry.addItem('GET', p);
   router.get(p, ...httpAction)
}

export default reg;
