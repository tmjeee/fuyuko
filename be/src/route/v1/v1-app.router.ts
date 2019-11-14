
import express, {Request, Response, NextFunction, Router, Express} from 'express';
import {i} from '../../logger';
import {Registry} from "../../registry";
import v1 = require("uuid/v1");
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';
import {range} from "../../util";

// routes
import registerActivateInvirationRoute from './POST-activate-invitation.route';
import registerApproveSelfRegistrationRoute from './POST-approve-self-registration.route';
import registerCreateInvitationRoute from './POST-create-invitation.route';
import registerGetUserAvatarRoutes from './GET-user-avatar.route';
import registerGetGlobalAvatarRoute from './GET-global-avatar.route';
import registerGetInvitationByCodeRoute from './GET-invitation-by-code.route';
import registerGetAllGlobalAvatarsRoute from './GET-all-global-avatars.route';
import registerLoginRoute from './POST-login.route';
import registerLogoutRoute from './POST-logout.route';
import registerSelfRegisterRoute from './POST-self-register.route';
import registerSaveUserAvatarRoute from './POST-save-user-avatar.route';
import registerSaveUserRoute from './POST-save-user.route';
import registerGetUserRoute from './GET-user.route';
import registerGetAllGroupsRoute from './GET-all-groups.route';
import registerGetGroupByIdRoute  from './GET-group-by-id.route';
import registerGetGroupsWithNoSuchRoleRoute from './GET-groups-with-no-such-role.route';
import registerDeleteRoleFromGroupRoute from './DELETE-role-from-group.route';
import registerAddRoleToGroupRoute from './POST-add-role-to-group.route';

const v1AppRouter:Router  = express.Router();


const reg = (app: Express, regi: Registry) => {
    const p = '/v1';
    const registry = regi.newRegistry(p);
    app.use(p, v1AppRouter);

    registerActivateInvirationRoute(v1AppRouter, registry);
    registerApproveSelfRegistrationRoute(v1AppRouter, registry);
    registerCreateInvitationRoute(v1AppRouter, registry);
    registerGetUserAvatarRoutes(v1AppRouter, registry);
    registerGetGlobalAvatarRoute(v1AppRouter, registry);
    registerGetAllGlobalAvatarsRoute(v1AppRouter, registry);
    registerGetInvitationByCodeRoute(v1AppRouter, registry);
    registerLoginRoute(v1AppRouter, registry);
    registerLogoutRoute(v1AppRouter, registry);
    registerSelfRegisterRoute(v1AppRouter, registry);
    registerSaveUserAvatarRoute(v1AppRouter, registry);
    registerSaveUserRoute(v1AppRouter, registry);
    registerGetUserAvatarRoutes(v1AppRouter, registry);
    registerGetUserRoute(v1AppRouter, registry);
    registerGetAllGroupsRoute(v1AppRouter, registry);
    registerGetGroupByIdRoute(v1AppRouter, registry);
    registerGetGroupsWithNoSuchRoleRoute(v1AppRouter, registry);
    registerDeleteRoleFromGroupRoute(v1AppRouter, registry);
    registerAddRoleToGroupRoute(v1AppRouter, registry);
}

export default reg;
