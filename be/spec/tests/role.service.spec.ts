import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {
    addOrUpdateRole,
    addRoleToGroup,
    getAllRoles,
    getGroupByName,
    getGroupsWithRole,
    getRoleByName, removeRoleFromGroup
} from '../../src/service';
import {Role} from '@fuyuko-common/model/role.model';
import {Group} from '@fuyuko-common/model/group.model';


describe('role.service', () => {

    let adminRole: Role;
    let viewGroup: Group;

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
        adminRole = await getRoleByName('ADMIN');
        viewGroup = await getGroupByName('VIEW Group');
    }, JASMINE_TIMEOUT);

    it ('test addOrUpdateRole', async () => {
        const err: string[] = await addOrUpdateRole({
           name: "XXXROLE",
           description: "XXXROLE DESCRIPTION"
        } as Role);
        //console.log(err);

        expect(err.length).toBe(0);

        const r: Role = await getRoleByName('XXXROLE');
        // console.log('***** r', r);
        expect(r.name).toBe('XXXROLE');
        expect(r.description).toBe('XXXROLE DESCRIPTION')

        const err2: string[] = await addOrUpdateRole({
            id: r.id,
            name: 'YYYROLE',
            description: 'YYYROLE DESCRIPTION'
        } as Role);
        expect(err2.length).toBe(0);
        const rrr: Role = await getRoleByName('XXXROLE');
        const rr: Role = await getRoleByName('YYYROLE');
        // console.log('***** rr', rr);
        expect(rr.id).toBe(r.id);
        expect(rr.name).toBe('YYYROLE');
        expect(rr.description).toBe('YYYROLE DESCRIPTION');
        expect(rrr).toBeFalsy();
    });

    it ('test addRoleToGroup removeRoleFromGroup', async () => {

        const err1: string[] = await addRoleToGroup(viewGroup.id, adminRole.name);
        expect(err1.length).toBe(0);

        const gs: Group[] = await getGroupsWithRole(adminRole.name);
        const g: Group = gs.find((_g: Group) => _g.id == viewGroup.id);
        const r: Role = g.roles.find((_r: Role) => _r.name == adminRole.name);

        expect(g).toBeTruthy();
        expect(r).toBeTruthy();

        const err2: string[] = await removeRoleFromGroup(adminRole.name, viewGroup.id);
        expect(err1.length).toBe(0);

        const gs1: Group[] = await getGroupsWithRole(adminRole.name);
        const g1: Group = gs1.find((_g: Group) => _g.id == viewGroup.id);

        expect(g1).toBeFalsy();
    });

    it('test getRoleByName', async () => {

        const r: Role = await getRoleByName('VIEW');

        expect(r).toBeTruthy();
        expect(r.name).toBe('VIEW');
    });

    it ('test getAllRoles', async () => {
        const r: Role[] = await getAllRoles();

        // console.log(util.inspect(r));
        expect(r.length).toBeGreaterThanOrEqual(4);
        expect(r[0].name).toBe('VIEW');
        expect(r[1].name).toBe('EDIT');
        expect(r[2].name).toBe('ADMIN');
        expect(r[3].name).toBe('PARTNER');
    });
});