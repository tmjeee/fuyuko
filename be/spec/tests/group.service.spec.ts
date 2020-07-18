import {JASMINE_TIMEOUT, setupBeforeAll, setupTestDatabase} from "../helpers/test-helper";
import {
    addOrUpdateGroup,
    addUserToGroup,
    deleteGroup,
    getAllGroups, getAllGroupsCount,
    getGroupById,
    getGroupByName, getGroupsWithRole, searchForGroupByName, searchForGroupsWithNoSuchRole
} from "../../src/service";
import {Group} from "../../src/model/group.model";
import * as util from "util";


describe(`group.service`, () => {
    beforeAll(() => {
        setupTestDatabase();
    });
    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);

    it (`search`, async () => {
        const g1: Group[] = await searchForGroupByName('group');
        const g1Names: string[] = g1.map((g: Group) => g.name);
        expect(g1.length).toBeGreaterThanOrEqual(4);
        expect(g1Names).toContain('VIEW Group');
        expect(g1Names).toContain('EDIT Group');
        expect(g1Names).toContain('ADMIN Group');
        expect(g1Names).toContain('PARTNER Group');

        const g2: Group[] = await searchForGroupsWithNoSuchRole('admin');
        const g2Names: string[] = g2.map((g: Group) => g.name);
        expect(g2.length).toBeGreaterThanOrEqual(3);
        expect(g2Names).toContain('VIEW Group');
        expect(g2Names).toContain('EDIT Group');
        expect(g2Names).toContain('PARTNER Group');

        const g3: Group[] = await getGroupsWithRole('admin');
        const g3Names: string[] = g3.map((g: Group) => g.name);
        expect(g3.length).toBeGreaterThanOrEqual(1);
        expect(g3Names).toContain('ADMIN Group');
    });

    it(`add and delete group`, async() => {
        const groupName = `group-${new Date()}`;
        const groupDescription = groupName;

        // verify create group
        const errors: string[] = await addOrUpdateGroup({id: -1, name: groupName, description: groupDescription, isSystem: false});
        expect(errors.length).toBe(0);

        // verify group created
        const group: Group = await getGroupByName(groupName);
        expect(group).toBeDefined();
        expect(group.name).toBe(groupName);
        expect(group.description).toBe(groupDescription);

        // verify get groups
        const groups: Group[] = await getAllGroups();
        const groupsCount: number = await getAllGroupsCount();
        expect(groups).toBeDefined();
        expect(groups.length).toBeGreaterThanOrEqual(groupsCount);

        // verify delete group
        const dErrors: string[] = await deleteGroup([group.id]);
        expect(dErrors.length).toBe(0);

        // verify group deleted
        const dGroup: Group = await getGroupById(group.id);
        expect(dGroup).toBeFalsy();
    });
});