
import config from '../config';
import sha256 from "sha256";

// 72fbe6d9e8646cce1d1f066a76d34d69db3e2184d45dfc45ba13bbf5e51186eb - test
export const hashedPassword = (passwd: string): string => {
    const salt: string = config.salt;
    return sha256.x2(`${salt}${passwd}`);
}

