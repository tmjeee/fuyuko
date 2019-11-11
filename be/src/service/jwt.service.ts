import {User} from "../model/user.model";
import jwt from "jsonwebtoken";
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