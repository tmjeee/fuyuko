
import config from '../config';
import sha256 from 'sha256';

class PasswordService {
    hashedPassword(passwd: string): string {
        const salt: string = config.salt;
        return sha256.x2(`${salt}${passwd}`);
    }
}

const s = new PasswordService();
export const
    hashedPassword = s.hashedPassword.bind(s);

