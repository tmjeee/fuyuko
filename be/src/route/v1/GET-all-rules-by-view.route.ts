import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {Rule} from "../../model/rule.model";
import {
    Rule2,
} from "../model/server-side.model";
import {convert} from '../../service/conversion-rule.service';
import {ROLE_VIEW} from "../../model/role.model";
import {getRule2s} from "../../service/rule.service";

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const rule2s: Rule2[] = await getRule2s(viewId);
        const rules: Rule[] = convert(rule2s);
        res.status(200).json(rules);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
