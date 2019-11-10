import {NextFunction, Router, Request, Response} from "express";

const activateHttpAction = [
    (req: Request, res: Response , next: NextFunction ) => {
        const code = req.params['code'];
        if (code) {
            res.json()
        }
    }
];

const reg = (router: Router) => {

    router.get('/activate-invitation/:code', activateHttpAction);
}