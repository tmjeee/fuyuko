
import express, {Request, Response, NextFunction, Router, Express} from 'express';
import {i} from '../../logger';
import {Registry} from "../../registry";
import v1 = require("uuid/v1");
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';
import {range} from "../../util";

// routes
import registerGetHeartbeatRoute from './GET-heartbeat-route';
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
import registerGetGroupsWithRoleRoute from './GET-groups-with-role.route';
import registerDeleteRoleFromGroupRoute from './DELETE-role-from-group.route';
import registerPostAddRoleToGroupRoute from './POST-add-role-to-group.route';
import registerPostAddUserToGroupRoute from './POST-add-user-to-group.route';
import registerGetUsersNotInGroupRoute from './GET-users-not-in-group.route';
import registerGetUsersInGroupRoute from './GET-users-in-group.route';
import registerDeleteUserFromGroupRoute from './DELETE-user-from-group.route';
import registerGetUsersByStatusRoute from './GET-users-by-status.route';
import registerDeleteUserByIdRoute from './DELETE-user-by-id.route';
import registerPostChangeUserStatusRoute from './POST-change-user-status.route';
import registerGetSelfRegistersRoute from './GET-self-register.route';
import registerDeleteSelfRegisterRoute from './DELETE-self-register.route';
import registerGetAllRolesRoute from './GET-all-roles.route';
import registerGetAllViewsRoute from './GET-all-views.route';
import registerPostSaveViewsRoute from './POST-save-view.route';
import registerDeleteViewsRoute from './DELETE-views.route';
import registerGetAllAttributesByViewRoute from './GET-all-attributes-by-view.route';
import registerGetSearchAllAttributesByViewRoute from './GET-search-attributes-by-view.route';
import registerPostUpdateAttributesRoute from './POST-update-attributes.route';
import registerPostUpdateAttributeStatusRoute from './POST-update-attributes.route';
import registerGetAllItemsByViewRoute from './GET-all-items-by-view.route';

const v1AppRouter:Router  = express.Router();


const reg = (app: Express, regi: Registry) => {
    const p = '/v1';
    const registry = regi.newRegistry(p);
    app.use(p, v1AppRouter);

    registerGetHeartbeatRoute(v1AppRouter, registry);
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
    registerGetGroupsWithRoleRoute(v1AppRouter, registry);
    registerDeleteRoleFromGroupRoute(v1AppRouter, registry);
    registerPostAddRoleToGroupRoute(v1AppRouter, registry);
    registerGetUsersNotInGroupRoute(v1AppRouter, registry);
    registerGetUsersInGroupRoute(v1AppRouter, registry);
    registerPostAddUserToGroupRoute(v1AppRouter, registry);
    registerDeleteUserFromGroupRoute(v1AppRouter, registry);
    registerGetSelfRegistersRoute(v1AppRouter, registry);
    registerDeleteSelfRegisterRoute(v1AppRouter, registry);
    registerGetUsersByStatusRoute(v1AppRouter, registry);
    registerDeleteUserByIdRoute(v1AppRouter, registry)
    registerPostChangeUserStatusRoute(v1AppRouter, registry);
    registerGetAllRolesRoute(v1AppRouter, registry);
    registerGetAllViewsRoute(v1AppRouter, registry);
    registerPostSaveViewsRoute(v1AppRouter, registry);
    registerDeleteViewsRoute(v1AppRouter, registry);
    registerGetAllAttributesByViewRoute(v1AppRouter, registry);
    registerGetSearchAllAttributesByViewRoute(v1AppRouter, registry);
    registerPostUpdateAttributesRoute(v1AppRouter, registry);
    registerPostUpdateAttributeStatusRoute(v1AppRouter, registry);
    registerGetAllItemsByViewRoute(v1AppRouter, registry);
}


export default reg;
