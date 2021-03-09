import {NextFunction, Router, Request, Response} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Fields, Files, File} from 'formidable';
import {multipartParse} from '../../service';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {UserAvatarResponse} from '@fuyuko-common/model/api-response.model';
import {saveUserAvatar} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);

        const p: {fields: Fields, files: Files} = await multipartParse(req);

        const globalAvatarName: string = p.fields.globalAvatarName as string;
        const customAvatarFile: File = p.files.customAvatarFile as File;


        const r: {userAvatarId: number, errors: string[]} = await saveUserAvatar(userId, {globalAvatarName, customAvatarFile});
        if (r.errors && r.errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: {
                    userAvatarId: r.userAvatarId
                }
            } as UserAvatarResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `UserId ${userId}, Avatar updated`,
                payload: {
                    userAvatarId: r.userAvatarId
                }
            } as UserAvatarResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId/avatar';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
