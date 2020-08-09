import {addUserNotification, getUserByUsername, getUserNotifications} from "../../src/service";
import {User} from "../../src/model/user.model";
import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {NewNotification} from "../../src/model/notification.model";


describe('notification.service', () => {
    
    let user: User;
    
    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
        user = await getUserByUsername('cypress');
    }, JASMINE_TIMEOUT);

    it('add and get user notifications', async () => {
        await addUserNotification(user.id, {
           title: 'title',
           message: 'message',
           status: "SUCCESS" 
        } as NewNotification)
        
        const newNotifications: NewNotification[] = await getUserNotifications(user.id);
        
        expect(newNotifications).toBeDefined();
        expect(newNotifications.length).toBe(1);
        expect(newNotifications[0].title).toBe('title');
        expect(newNotifications[0].message).toBe('message');
        expect(newNotifications[0].status).toBe('SUCCESS');
    });
});