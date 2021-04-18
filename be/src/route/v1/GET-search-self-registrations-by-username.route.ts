import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from './common-middleware';
import {SelfRegistration} from '@fuyuko-common/model/self-registration.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {searchSelfRegistrationsByUsername} from '../../service';


// CHECKED

const httpAction: any[] = [
   [
      param('username')
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   async (req: Request, res: Response, next: NextFunction) => {

      const username: string = req.params.username;

       const selfRegistrations: SelfRegistration[] = await searchSelfRegistrationsByUsername(username);
       const apiResponse: ApiResponse<SelfRegistration[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Self registrations retrieved`,
            }],
           payload: selfRegistrations
       };
       res.status(200).json(apiResponse);
   }
];


export const reg = (router: Router, registry: Registry) => {
   const p = `/search/self-registration/:username?`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
}


export default reg;
