"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activateHttpAction = [
    (req, res, next) => {
        const code = req.params['code'];
        if (code) {
            res.json();
        }
    }
];
const reg = (router) => {
    router.get('/activate-invitation/:code', activateHttpAction);
};
