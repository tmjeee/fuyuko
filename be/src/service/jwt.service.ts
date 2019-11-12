import {User} from "../model/user.model";
import * as jwt from "jsonwebtoken";
import {JwtPayload} from "../model/jwt.model";
import config from '../config';


export const createJwtToken = (user: User): string => {
    return jwt.sign(
        {
            user
        } as JwtPayload ,
        config["jwt-secret"],
        {
            expiresIn: config["jwt-expiration"]
        }).toString();
}

export const verifyJwtToken = (jwtToken: string): JwtPayload => {
    return jwt.verify(jwtToken, config["jwt-secret"]) as JwtPayload;
}