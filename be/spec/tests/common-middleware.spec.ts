import * as m from "../../src/route/v1/common-middleware";
import {Request, Response, NextFunction} from 'express';
import {ROLE_ADMIN, ROLE_EDIT, ROLE_VIEW} from "../../src/model/role.model";
import {JwtPayload} from "../../src/model/jwt.model";
import {JASMINE_TIMEOUT, setupBeforeAll, setupTestDatabase} from "../helpers/test-helper";
import {getUserByUsername} from "../../src/service/user.service";
import {User} from "../../src/model/user.model";

describe('common-middleware', () => {

    let admin: User;
    let viewer: User;
    let editor: User;
    let partner: User;

    beforeAll(() => {
        setupTestDatabase();
    });

    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);

    beforeAll(async (done: DoneFn) => {
        admin = await getUserByUsername('admin1');
        viewer = await getUserByUsername('viewer1');
        editor = await getUserByUsername('editor1');
        partner = await getUserByUsername('partner1');
        done();
    });

    it(`aFnAllTrue #1`, async () => {
        const r1: boolean = await m.aFnAllTrue([
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
            ],
            jasmine.createSpyObj('request', ['']),
            jasmine.createSpyObj('response', ['']),
            []);
        expect(r1).toBe(true);
    });

    it(`aFnAllTrue #2`, async () => {
        const r1: boolean = await m.aFnAllTrue([
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
            ],
            jasmine.createSpyObj('request', ['']),
            jasmine.createSpyObj('response', ['']),
            []);
        expect(r1).toBe(false);
    });

    it(`aFnAllFalse #1`, async () => {
        const r1: boolean = await m.aFnAllFalse([
            (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
            (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
            (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
        ],
        jasmine.createSpyObj(`request`, ['']),
        jasmine.createSpyObj(`response`, ['']),
        []);
        expect(r1).toBe(true);
    });

    it(`aFnAllFalse #2`, async () => {
        const r1: boolean = await m.aFnAllFalse([
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
            ],
            jasmine.createSpyObj(`request`, ['']),
            jasmine.createSpyObj(`response`, ['']),
            []);
        expect(r1).toBe(false);
    });

    it(`aFnAnyTrue #1`, async () => {
        const r1: boolean = await m.aFnAnyTrue([
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
            ],
            jasmine.createSpyObj(`request`, ['']),
            jasmine.createSpyObj(`response`, ['']),
            []);
        expect(r1).toBe(true);
    });

    it(`aFnAnyTrue #2`, async () => {
        const r1: boolean = await m.aFnAnyTrue([
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
            ],
            jasmine.createSpyObj(`request`, ['']),
            jasmine.createSpyObj(`response`, ['']),
            []);
        expect(r1).toBe(false);
    });

    it (`aFnAnyFalse #1`, async () => {
       const r1: boolean = await m.aFnAnyFalse([
               (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
               (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
               (req: Request, res: Response, msg: string[]) => Promise.resolve(false),
           ],
           jasmine.createSpyObj(`request`, ['']),
           jasmine.createSpyObj(`response`, ['']),
           []);
       expect(r1).toBe(true);
    });

    it (`aFnAnyFalse #2`, async () => {
        const r1: boolean = await m.aFnAnyFalse([
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
                (req: Request, res: Response, msg: string[]) => Promise.resolve(true),
            ],
            jasmine.createSpyObj(`request`, ['']),
            jasmine.createSpyObj(`response`, ['']),
            []);
        expect(r1).toBe(false);
    });


    it(`vFnHasAnyUserRoles`, async () => {
        const req = jasmine.createSpyObj('request', ['']);
        const res = jasmine.createSpyObj('response', ['']);
        const msg: string[] = [];

        spyOn(m, 'getJwtPayload').and.returnValue({
            user: { id: admin.id }
        } as JwtPayload);

        const r1: boolean = await (m.vFnHasAnyUserRoles([ROLE_VIEW, ROLE_EDIT]))(req, res, msg);
        const r2: boolean = await (m.vFnHasAnyUserRoles(['asdsd']))(req, res, msg);
        expect(r1).toBe(true);
        expect(r2).toBe(false);

    });


    it(`vFnHasAllUserRoles`, async () => {
        const req = jasmine.createSpyObj('request', ['']);
        const res = jasmine.createSpyObj('response', ['']);
        const msg: string[] = [];

        spyOn(m, 'getJwtPayload').and.returnValue({
            user: { id: admin.id }
        } as JwtPayload);

        const r1: boolean = await (m.vFnHasAllUserRoles([ROLE_VIEW, ROLE_EDIT, ROLE_ADMIN]))(req, res, msg);
        const r2: boolean = await (m.vFnHasAllUserRoles(['xxxxx', ROLE_EDIT, ROLE_ADMIN]))(req, res, msg);

        expect(r1).toBe(true);
        expect(r2).toBe(false);
    });


    it(`vFnHasNoneUserRoles`, async () => {
        const req = jasmine.createSpyObj('request', ['']);
        const res = jasmine.createSpyObj('response', ['']);
        const msg: string[] = [];

        spyOn(m, 'getJwtPayload').and.returnValue({
            user: { id: admin.id }
        } as JwtPayload);

        const r1: boolean = await (m.vFnHasNoneUserRoles([ROLE_EDIT, ROLE_VIEW, ROLE_ADMIN]))(req, res, msg);
        const r2: boolean = await (m.vFnHasNoneUserRoles(['xxxx', 'yyyy']))(req, res, msg);

        expect(r1).toBe(false);
        expect(r2).toBe(true);
    });
});