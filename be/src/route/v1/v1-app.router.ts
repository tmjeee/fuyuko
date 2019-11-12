
import express, {Request, Response, NextFunction, Router} from 'express';
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';

// routes
import activateInvirationRoute from './activate-invitation.route';
import approveSelfRegistrationRoute from './approve-self-registration.route';
import createInvitationRoute from './create-invitation.route';
import getUserAvatarRoutes from './get-user-avatar.route';
import getGlobalAvatarRoute from './get-global-avatar.route';
import getInvitationByCodeRoute from './get-invitation-by-code.route';
import getAllGlobalAvatars from './get-all-global-avatars.route';
import loginRoute from './login.route';
import logoutRoute from './logout.route';
import selfRegisterRoutes from './self-register.route';
import saveUserAvatarRoutes from './save-user-avatar.route';

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
getUserAvatarRoutes(v1AppRouter);
getGlobalAvatarRoute(v1AppRouter);
getAllGlobalAvatars(v1AppRouter);
getInvitationByCodeRoute(v1AppRouter);
loginRoute(v1AppRouter);
logoutRoute(v1AppRouter);
selfRegisterRoutes(v1AppRouter);
saveUserAvatarRoutes(v1AppRouter);


export default v1AppRouter;
