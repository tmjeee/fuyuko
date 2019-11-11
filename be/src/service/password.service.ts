
import config from '../config';
import sha256 from "sha256";

export const hashedPassword = (passwd: string): string => {

    const salt: string = config.salt;
    return sha256.x2(`${salt}${passwd}`);
}