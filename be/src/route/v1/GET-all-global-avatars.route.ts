import {Router, Request, Response, NextFunction} from 'express';
import {validateMiddlewareFn} from './common-middleware';
import {GlobalAvatar} from '@fuyuko-common/model/avatar.model';
import {Registry} from '../../registry';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllGlobalAvatars} from '../../service';

// CHECKED
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const globalAvatar: GlobalAvatar[] = await getAllGlobalAvatars();
        res.status(200).json({
            status: 'SUCCESS',
            message: `Global avatar retrieval success`,
            payload: globalAvatar
        } as ApiResponse<GlobalAvatar[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/global/avatars';
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
