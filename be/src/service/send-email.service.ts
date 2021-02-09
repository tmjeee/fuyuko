
import config, {opts} from '../config';
import {createTransport, SentMessageInfo, Transporter, SendMailOptions, TransportOptions} from "nodemailer";
import {i} from '../logger';

class SendEmailService {

    /**
     * =================
     * === sendEmail ===
     * =================
     */
    async sendEmail(toEmail: string, subject: string, text: string): Promise<SendMailOptions> {
        const fromEmail = config['smtp-from-email'];
        const info: SentMessageInfo = await this._sendEmail( toEmail, subject, fromEmail, text, {
            host: config['smtp-host'],
            port: config['smtp-port'],
            secure: config['smtp-secure'],
            auth: {
                user: config['smtp-user'],
                pass: config['smtp-password']
            }
        } as TransportOptions);
        return info;
    };

    private async _sendEmail(toEmail: string, subject: string, text: string, fromEmail: string, options: TransportOptions): Promise<SendMailOptions> {
        if (opts.test) {
            return {};
        } else {
            const transporter: Transporter = createTransport(options);
            const info: SentMessageInfo = await transporter.sendMail({
                from: fromEmail,
                to: toEmail,
                subject,
                text
            } as SendMailOptions);

            i(`Send email `, info);
            return info;
        }
    };

}

const s = new SendEmailService();
export const
    sendEmail = s.sendEmail.bind(s);

