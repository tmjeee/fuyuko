import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import { Invitation } from '@fuyuko-common/model/invitation.model';
import {Registry} from '../../registry';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getInvitationByCode} from '../../service';

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
        const apiResponse: ApiResponse<Invitation> = {
            messages: [{
                status: 'SUCCESS',
                message: `invitation retrieved successfully`,
            }],
            payload: invitation
        };
        res.status(200).json(apiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
   const p = '/invitations/:code';
   registry.addItem('GET', p);
   router.get(p, ...httpAction)
}

export default reg;
