
import express, {Request, Response, NextFunction, Router, Express} from 'express';
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';
import {range} from "../../util";
import {i} from '../../logger';

// routes
import registerActivateInvirationRoute from './activate-invitation.route';
import registerApproveSelfRegistrationRoute from './approve-self-registration.route';
import registerCreateInvitationRoute from './create-invitation.route';
import registerGetUserAvatarRoutes from './get-user-avatar.route';
import registerGetGlobalAvatarRoute from './get-global-avatar.route';
import registerGetInvitationByCodeRoute from './get-invitation-by-code.route';
import registerGetAllGlobalAvatarsRoute from './get-all-global-avatars.route';
import registerLoginRoute from './login.route';
import registerLogoutRoute from './logout.route';
import registerSelfRegisterRoute from './self-register.route';
import registerSaveUserAvatarRoute from './save-user-avatar.route';
import registerSaveUserRoute from './save-user.route';

const v1AppRouter:Router  = express.Router();

type RegistryItem = {path: string, description: string};

export class Registry {
    name: string;
    children: Registry[];
    items: RegistryItem[];
    constructor(n: string) {
        this.name = n;
        this.children = [];
        this.items = [];
    }
    static newRegistry(n: string): Registry {
        return new Registry(n);
    }
    newRegistry(n: string): Registry {
        const registry = new Registry(n);
        this.children.push(registry);
        return registry;
    }
    addItem(path: string, description: string) {
        this.items.push({path, description} as RegistryItem);
    }
    print(arg = {indent: 0, text: ''}) {
        for (const child of this.children) {
            arg.indent++;
            child.print(arg);
        }
        range(0, arg.indent).forEach(()=> arg.text += ' ');
        arg.text += `${this.name}\n`;
        for (const item of this.items) {
            range(0, arg.indent + 2).forEach(()=> arg.text += ' ');
            arg.text += `${item.path} - ${item.description}\n`;
        }
        return arg;
    }
}

const reg = (app: Express) => {
    const p = '/v1';
    const registry = Registry.newRegistry(p);
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

    i('URL Mapings :-\n' + registry.print({indent: 2, text: ''}).text);
}

/*
v1AppRouter.post('/p', (req: Request, res: Response, next: NextFunction) => {
    new formidable.IncomingForm().parse(req, (error: any, fields: Fields, files: Files) => {
    });
});
 */



export default reg;
