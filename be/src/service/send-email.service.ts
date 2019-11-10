
import config from '../config';
import {createTransport, SentMessageInfo, Transporter, SendMailOptions} from "nodemailer";
import {i} from '../logger';

const xoauth2 = require('xoauth2');

export const sendEmail = async (toEmail: string, subject: string, text: string): Promise<SendMailOptions> => {

    // kdyvfchvtpkospng
    const transporter: Transporter = createTransport({
        host: config["smtp-host"],
        port: config["smtp-port"],
        secure: config["smtp-secure"], // upgrade later with STARTTLS
        auth: {
            user: config["smtp-user"],
            pass: config["smtp-password"]
        }
    } as any);

    const info: SentMessageInfo = await transporter.sendMail({
        from: config["smtp-from-email"],
        to: toEmail,
        subject,
        text
    } as SendMailOptions);

    i(`Send email `, info);

    return info;
}

