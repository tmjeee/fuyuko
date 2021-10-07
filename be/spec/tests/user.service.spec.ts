import {
    addUser,
    AddUserInput,
    addUserToGroup,
    changeUserStatus,
    deleteUser,
    deleteUserFromGroup,
    getGroupByName,
    getRoleByName,
    getUserAvatarContent,
    getUserById,
    getUserByUsername,
    getUsersByStatus,
    getUsersInGroup,
    hasAllUserRoles, hasAnyUserRoles, hasNoneUserRoles,
    searchForUserNotInGroup,
    searchUserByUsernameAndStatus,
    updateUser,
    UpdateUserInput
} from '../../src/service';
import {User} from '@fuyuko-common/model/user.model';
import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {Group} from '@fuyuko-common/model/group.model';
import {BinaryContent} from '@fuyuko-common/model/binary-content.model';

describe('user.service', () => {

    let viewer1: User;
    let admin1: User;
    let adminGroup: Group;

    beforeAll(async () => {
        console.log('************************************* user.service beforeAll');
        await setupTestDatabase();
        await setupBeforeAll2();
        viewer1 = await getUserByUsername('viewer1')
        admin1 = await getUserByUsername('admin1');
        adminGroup = await getGroupByName('ADMIN Group');
        console.log('***** initial viewer', viewer1);
    }, JASMINE_TIMEOUT);


    it('test addUser and deleteUser', async function () {
        const username = `user-${Math.random()}`;
        const err1: string[] = await addUser({
            username,
            email: `${username}@gmail.com`,
            firstName: username,
            lastName: username,
            password: 'test',
            status: 'ENABLED',
            theme: 'xxxxx'
        } as AddUserInput);
        expect(err1.length).toBe(0);

        const user1: User = await getUserByUsername(username);
        expect(user1).toBeTruthy();

        const r2: boolean = await deleteUser(user1.id);
        expect(r2).toBeTrue();

        const user2: User = await getUserByUsername(username);
        expect(user2).toBeFalsy();
    });

    it('test addUser and updateUser', async function() {
        const username = `user-${Math.random()}`;
        const err1: string[] = await addUser({
            username,
            email: `${username}@gmail.com`,
            firstName: username,
            lastName: username,
            password: 'test',
            status: 'ENABLED',
            theme: 'xxxxx'
        } as AddUserInput);
        console.log('****', err1);
        expect(err1.length).toBe(0);

        const user1: User = await getUserByUsername(username);
        expect(user1.username).toBe(username);
        expect(user1.firstName).toBe(username);
        expect(user1.lastName).toBe(username);
        expect(user1.email).toBe(`${username}@gmail.com`);
        expect(user1.theme).toBe('xxxxx');

        const newUsername = `user-${Math.random()}`;
        const err2: string[] = await updateUser({
           userId: user1.id,
           email: `${newUsername}@gmail.com`,
           firstName: newUsername,
           lastName: newUsername,
           theme: 'yyyyy',
           password: 'test'
        } as UpdateUserInput);

        const user2: User = await getUserByUsername(username);
        expect(user2.username).toBe(username);
        expect(user2.firstName).toBe(newUsername);
        expect(user2.lastName).toBe(newUsername);
        expect(user2.email).toBe(`${newUsername}@gmail.com`);
        expect(user2.theme).toBe('yyyyy');
    });

    it('test changeUserStatus and getUsersByStatus', async function () {
        console.log('**** viewer', viewer1);
        const r1: boolean = await changeUserStatus(viewer1.id, 'DISABLED');
        expect(r1).toBe(true);

        const users1: User[] = await getUsersByStatus('DISABLED');
        const user1 = users1.find((u: User) => u.id == viewer1.id);
        expect(user1).toBeTruthy();
        expect(user1!.username).toBe(viewer1.username);

        const r2: boolean = await changeUserStatus(viewer1.id, 'ENABLED');
        expect(r2).toBe(true);

        const users2: User[] = await getUsersByStatus('ENABLED');
        const user2 = users2.find((u: User) => u.id == viewer1.id);
        expect(user2).toBeTruthy();
        expect(user2!.username).toBe(viewer1.username);
    });

    it ('test addUserToGroup and deleteUserFromGroup and getUsersInGroup', async function () {
        console.log('**** viewer', viewer1, adminGroup);
        const err1: string[] = await addUserToGroup(viewer1.id, adminGroup.id);
        expect(err1.length).toBe(0);

        const users1: User[] = await getUsersInGroup(adminGroup.id);
        const user1 = users1.find((u: User) => u.id == viewer1.id);
        expect(user1).toBeTruthy();
        expect(user1!.id).toBe(viewer1.id);

        const err2: string[] = await deleteUserFromGroup(viewer1.id, adminGroup.id);
        expect(err2.length).toBe(0);

        const users2: User[] = await getUsersInGroup(adminGroup.id);
        const user2 = users2.find((u: User) => u.id == viewer1.id);
        expect(user2).toBeFalsy();
    });



    it ('test getUserAvatarContent', async function () {
        const binaryContent: BinaryContent = await getUserAvatarContent(viewer1.id);
        expect(binaryContent).toBeTruthy();
    });

    it('test searchForUserNotInGroup', async () => {
        const users1: User[] = await searchForUserNotInGroup(adminGroup.id);
        expect(users1.length).toBeGreaterThan(1);

        const users2: User[] = await searchForUserNotInGroup(adminGroup.id, 'viewer');
        expect(users2.length).toBeGreaterThan(1);

        const users3: User[] = await searchForUserNotInGroup(adminGroup.id, 'xasdasdsdsdsasds');
        expect(users3.length).toBe(0);
    });

    it('test searchUserByUsernameAndStatus', async function () {

        const users1: User[] = await searchUserByUsernameAndStatus('ENABLED', 'viewer');
        const users2: User[] = await searchUserByUsernameAndStatus('DISABLED', 'disabled');
        const users3: User[] = await searchUserByUsernameAndStatus('ENABLED', 'disabled');
        const users4: User[] = await searchUserByUsernameAndStatus('DISABLED', 'viewer');

        // console.log(util.inspect(users2));
        expect(users1.length).toBeGreaterThan(1);
        expect(users2.length).toBeGreaterThan(1);
        expect(users3.length).toBe(0);
        expect(users4.length).toBe(0);
    });


    it ('test hasAllUserRoles', async function () {
        const r1: boolean = await hasAllUserRoles(viewer1.id, ['VIEW']);
        const r2: boolean = await hasAllUserRoles(viewer1.id, ['VIEW', 'ADMIN']);
        const r3: boolean = await hasAllUserRoles(admin1.id, ['ADMIN']);
        const r4: boolean = await hasAllUserRoles(admin1.id, ['ADMIN', 'VIEW', 'XXXX']);

        expect(r1).toBe(true);
        expect(r2).toBe(false);
        expect(r3).toBe(true);
        expect(r4).toBe(false);
    });

    it ('test hasAnyUserRoles', async function () {
        const r1: boolean = await hasAnyUserRoles(viewer1.id, ['VIEW', 'ADMIN']);
        const r2: boolean = await hasAnyUserRoles(viewer1.id, ['XXXX', 'VIEW']);
        const r3: boolean = await hasAnyUserRoles(admin1.id, ['XXXX', 'YYYYY']);

        expect(r1).toBe(true);
        expect(r2).toBe(true);
        expect(r3).toBe(false);
    });

    it ('test hasNoneUserRole', async function () {
        const r1: boolean = await hasNoneUserRoles(viewer1.id, ['XXX', 'YYYY']);
        const r2: boolean = await hasNoneUserRoles(viewer1.id, ['VIEW', 'XXXX']);

        expect(r1).toBe(true);
        expect(r2).toBe(false);
    });

    it ('test getUserByUsername', async function () {

        const user1: User = await getUserByUsername(viewer1.username);
        const user2: User = await getUserByUsername('xxxxxxxxx');

        expect(user1).toBeTruthy();
        expect(user2).toBeFalsy();
    });

    it ('test getUserById', async function () {
        const user1: User = await getUserById(viewer1.id);
        const user2: User = await getUserById(999999);

        expect(user1).toBeTruthy();
        expect(user2).toBeFalsy();
    });
});
