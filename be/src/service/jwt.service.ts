import {User} from "../model/user.model";
import * as jwt from "jsonwebtoken";
import {JwtPayload} from "../model/jwt.model";
import config from '../config';
import {CreateJwtTokenEvent, DecodeJwtTokenEvent, fireEvent, VerifyJwtTokenEvent} from "./event/event.service";


class JwtService {
    /**
     *  ======================
     *  == createJwtToken ===
     *  ======================
     */
    createJwtToken(user: User): string {
        const jwtToken: string = jwt.sign(
            {
                user
            } as JwtPayload ,
            config["jwt-secret"],
            {
                expiresIn: config["jwt-expiration"]
            }).toString();

        fireEvent({
            type: 'CreateJwtTokenEvent',
            user,
            jwtToken
        } as CreateJwtTokenEvent);

        return jwtToken;
    }

    /**
     *  ======================
     *  == decodeJwtToken ===
     *  ======================
     */
    decodeJwtToken(jwtToken: string): JwtPayload {
        const jwtPayload: JwtPayload = jwt.decode(jwtToken) as JwtPayload;
        fireEvent({
            type: "DecodeJwtTokenEvent",
            jwtPayload
        } as DecodeJwtTokenEvent);
        return jwtPayload;
    }


    /**
     *  ======================
     *  == verifyJwtToken ===
     *  ======================
     */
    verifyJwtToken(jwtToken: string): JwtPayload {
        const jwtPayload: JwtPayload = jwt.verify(jwtToken, config["jwt-secret"]) as JwtPayload;
        fireEvent({
            type: "VerifyJwtTokenEvent",
            jwtPayload
        } as VerifyJwtTokenEvent);
        return jwtPayload;
    }
}

const s = new JwtService();
export const
    createJwtToken = s.createJwtToken.bind(s),
    decodeJwtToken = s.decodeJwtToken.bind(s),
    verifyJwtToken = s.verifyJwtToken.bind(s);