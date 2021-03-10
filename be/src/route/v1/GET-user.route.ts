import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {check} from 'express-validator';
import {
   aFnAnyTrue,
   v,
   validateJwtMiddlewareFn,
   validateMiddlewareFn,
   vFnHasAnyUserRoles
} from './common-middleware';
import {getUserById} from '../../service';
import {User} from '@fuyuko-common/model/user.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED

const httpAction: any[] = [
   [
      check('userId').exists().isNumeric()
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
   async (req: Request, res: Response, next: NextFunction) => {
      const userId: number = Number(req.params.userId);
      const user: User =  await getUserById(userId);
      res.status(200).json({
         status: 'SUCCESS',
         message: `User retrieved`,
         payload: user
      } as ApiResponse<User>);
   }
];

const reg = (router: Router, registry: Registry) => {
   const p = '/user/:userId';
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
}

export default reg;
