import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailVar } from './email.interfaces';

@Injectable()
export class EmailService {
  constructor(private readonly mailerSerivce: MailerService) {}

  async sendEmail(
    subject: string,
    template: string,
    context: EmailVar[],
  ): Promise<boolean> {
    try {
      let toEmail: string;
      context.find((vl) => {
        if (vl.key === 'userName') {
          toEmail = vl.value;
          return;
        }
      });

      const vars: EmailVar = context.find((vl) => vl.key === 'code');

      const email = await this.mailerSerivce.sendMail({
        to: toEmail,
        subject,
        template: `./${template}`,
        context: {
          email: toEmail,
          code: vars.value,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Hcast Your Email', 'verify-email.pug', [
      { key: 'code', value: code },
      { key: 'userName', value: email },
    ]);
  }

  sendForgotPassword(email: string, ps: string) {
    this.sendEmail('Your Hcast New Password', 'forgot-password.pug', [
      { key: 'code', value: ps },
      { key: 'userName', value: email },
    ]);
  }
}
