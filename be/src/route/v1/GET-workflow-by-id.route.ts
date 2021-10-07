import {Router} from "express";
import {Registry} from "../../registry";

const httpAction: any[] = [

];

const reg = (router: Router, registry: Registry) => {
    const p = `/workflow/:workflowId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;