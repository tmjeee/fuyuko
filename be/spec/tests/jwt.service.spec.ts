import {createJwtToken, decodeJwtToken, verifyJwtToken} from "../../src/service";
import {User} from "../../src/model/user.model";
import {JwtPayload} from "../../src/model/jwt.model";


describe('jwt.service', () => {
    
    it('jwtToken code and decode', () => {
        const jwt: string = createJwtToken({
           id: 1,
           username: 'tmjee',
           email: 'tmjee@gmail.com',
           firstName: 'tm',
           lastName: 'jee',
           groups: [],
           theme: 'theme'
        } as User);
        expect(jwt).toBeDefined();

        const jwtPayload: JwtPayload = decodeJwtToken(jwt);

        expect(jwtPayload.user.id).toBe(1);
        expect(jwtPayload.user.username).toBe('tmjee');
        expect(jwtPayload.user.email).toBe('tmjee@gmail.com');
        expect(jwtPayload.user.firstName).toBe('tm');
        expect(jwtPayload.user.lastName).toBe('jee');
        expect(jwtPayload.user.theme).toBe('theme');

        const jwtPayload1: JwtPayload = verifyJwtToken(jwt);

        expect(jwtPayload1.user.id).toBe(1);
        expect(jwtPayload1.user.username).toBe('tmjee');
        expect(jwtPayload1.user.email).toBe('tmjee@gmail.com');
        expect(jwtPayload1.user.firstName).toBe('tm');
        expect(jwtPayload1.user.lastName).toBe('jee');
        expect(jwtPayload1.user.theme).toBe('theme');
    });


    it('decodeJwtToken', () => {

    });
});