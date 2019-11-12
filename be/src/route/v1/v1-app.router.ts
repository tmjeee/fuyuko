
import express, {Request, Response, NextFunction, Router} from 'express';
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';

// routes
import activateInvirationRoute from './activate-invitation.route';
import approveSelfRegistrationRoute from './approve-self-registration.route';
import createInvitationRoute from './create-invitation.route';
import getAvatarRoutes from './get-avatar.route';
import getInvitationByCodeRoute from './get-invitation-by-code.route';
import loginRoute from './login.route';
import selfRegisterRoutes from './self-register.route';

const v1AppRouter:Router  = express.Router();

/*
v1AppRouter.post('/p', (req: Request, res: Response, next: NextFunction) => {
    new formidable.IncomingForm().parse(req, (error: any, fields: Fields, files: Files) => {
    });
});
 */

// register routes
activateInvirationRoute(v1AppRouter);
approveSelfRegistrationRoute(v1AppRouter);
createInvitationRoute(v1AppRouter);
getAvatarRoutes(v1AppRouter);
getInvitationByCodeRoute(v1AppRouter);
loginRoute(v1AppRouter);
selfRegisterRoutes(v1AppRouter);


export default v1AppRouter;
