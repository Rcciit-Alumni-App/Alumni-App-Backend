import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';

@Injectable()
export class MailerService {

    constructor(private readonly config: ConfigService) { }

    mailTransport() {
        const transport = nodemailer.createTransport({
            host: this.config.get<string>("MAIL_HOST"),
            port: this.config.get<number>("465"),
            secure: false,
            auth: {
                user: this.config.get<string>("MAIL_USER"),
                pass: this.config.get<string>("MAIL_PASSWORD")
            }
        });

        return transport;
    }

    async sendMail(sendMailDto: SendMailDto) {
        const { email, subject, mail_file, data } = sendMailDto;
        console.log('Executing send mail');
        const templatePath = path.join(__dirname, '../mails', mail_file);
        console.log('Template path:', templatePath);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }
        const html: string = await ejs.renderFile(templatePath, data);

        const transport = this.mailTransport();

        const options: Mail.Options = {
            from: {
                name: this.config.get("APP_NAME"),
                address: this.config.get("DEFAULT_MAIL_FROM")
            },
            to: email,
            subject,
            html,
        };

        try {
            const result = await transport.sendMail(options);
            return result;
        } catch (error) {
            console.log('[EMAIL_ERROR]', error);
        }
    }

}
