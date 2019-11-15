
import express, {Request, Response, NextFunction, Router, Express} from 'express';
import {i} from '../../logger';
import {Registry} from "../../registry";
import v1 = require("uuid/v1");
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';
import {range} from "../../util";

// routes
import registerPostActivateInvirationRoute from './POST-activate-invitation.route';
import registerPostApproveSelfRegistrationRoute from './POST-approve-self-registration.route';
import registerPostCreateInvitationRoute from './POST-create-invitation.route';
import registerGetUserAvatarRoutes from './GET-user-avatar.route';
import registerGetGlobalAvatarRoute from './GET-global-avatar.route';
import registerGetInvitationByCodeRoute from './GET-invitation-by-code.route';
import registerGetAllGlobalAvatarsRoute from './GET-all-global-avatars.route';
import registerPostLoginRoute from './POST-login.route';
import registerPostLogoutRoute from './POST-logout.route';
import registerPostSelfRegisterRoute from './POST-self-register.route';
import registerPostSaveUserAvatarRoute from './POST-save-user-avatar.route';
import registerPostSaveUserRoute from './POST-save-user.route';
import registerGetUserRoute from './GET-user.route';
import registerGetAllGroupsRoute from './GET-all-groups.route';
import registerGetGroupByIdRoute  from './GET-group-by-id.route';
import registerGetGroupsWithNoSuchRoleRoute from './GET-groups-with-no-such-role.route';
import registerDeleteRoleFromGroupRoute from './DELETE-role-from-group.route';
import registerPostAddRoleToGroupRoute from './POST-add-role-to-group.route';
import registerGetUsersNotInGroupRoute from './GET-users-not-in-group.route';
import registerPostAddUserToGroupRoute from './POST-add-role-to-group.route';
import registerDeleteUserFromGroupRoute from './DELETE-user-from-group.route';
import registerGetUsersByStatusRoute from './GET-users-by-status.route';
import registerDeleteUserByIdRoute from './DELETE-user-by-id.route';
import registerPostChangeUserStatusRoute from './POST-change-user-status.route';
import registerGetSelfRegistersRoute from './GET-self-register.route';
import registerDeleteSelfRegisterRoute from './DELETE-self-register.route';
import registerGetAllRolesRoute from './GET-all-roles.route';

const v1AppRouter:Router  = express.Router();


const reg = (app: Express, regi: Registry) => {
    const p = '/v1';
    const registry = regi.newRegistry(p);
    app.use(p, v1AppRouter);

    registerPostActivateInvirationRoute(v1AppRouter, registry);
    registerPostApproveSelfRegistrationRoute(v1AppRouter, registry);
    registerPostCreateInvitationRoute(v1AppRouter, registry);
    registerGetUserAvatarRoutes(v1AppRouter, registry);
    registerGetGlobalAvatarRoute(v1AppRouter, registry);
    registerGetAllGlobalAvatarsRoute(v1AppRouter, registry);
    registerGetInvitationByCodeRoute(v1AppRouter, registry);
    registerPostLoginRoute(v1AppRouter, registry);
    registerPostLogoutRoute(v1AppRouter, registry);
    registerPostSelfRegisterRoute(v1AppRouter, registry);
    registerPostSaveUserAvatarRoute(v1AppRouter, registry);
    registerPostSaveUserRoute(v1AppRouter, registry);
    registerGetUserAvatarRoutes(v1AppRouter, registry);
    registerGetUserRoute(v1AppRouter, registry);
    registerGetAllGroupsRoute(v1AppRouter, registry);
    registerGetGroupByIdRoute(v1AppRouter, registry);
    registerGetGroupsWithNoSuchRoleRoute(v1AppRouter, registry);
    registerDeleteRoleFromGroupRoute(v1AppRouter, registry);
    registerPostAddRoleToGroupRoute(v1AppRouter, registry);
    registerGetUsersNotInGroupRoute(v1AppRouter, registry);
    registerPostAddUserToGroupRoute(v1AppRouter, registry);
    registerDeleteUserFromGroupRoute(v1AppRouter, registry);
    registerGetSelfRegistersRoute(v1AppRouter, registry);
    registerDeleteSelfRegisterRoute(v1AppRouter, registry);
    registerGetUsersByStatusRoute(v1AppRouter, registry);
    registerDeleteUserByIdRoute(v1AppRouter, registry)
    registerPostChangeUserStatusRoute(v1AppRouter, registry);
    registerGetAllRolesRoute(v1AppRouter, registry);
}


export default reg;
