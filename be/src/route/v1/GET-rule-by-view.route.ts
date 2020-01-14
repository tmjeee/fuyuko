import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {check} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {getRule2} from "../../service/rule.service";
import {Rule2} from "../model/server-side.model";
import {Rule} from "../../model/rule.model";
import {convert} from "../../service/rule-conversion.service";


const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('ruleId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const ruleId: number = Number(req.params.ruleId);

        const r2: Rule2 = await getRule2(viewId, ruleId);
        const [r]: Rule[] = convert([r2]);

        res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
