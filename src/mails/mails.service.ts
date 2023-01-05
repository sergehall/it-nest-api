import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailConfimCodeEntity } from './entities/email-confim-code.entity';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}
  sendCodeByRegistration(emailAndCode: EmailConfimCodeEntity) {
    const url = `https://it-express-api.herokuapp.com/auth/confirm-registration?code=${emailAndCode.confirmationCode}`;

    this.mailerService
      .sendMail({
        to: emailAndCode.email,
        from: process.env.NODEMAILER_EMAIL,
        subject: 'Registration by confirmation code',
        template: 'index',
        text: 'welcome', // plaintext body
        html: `<h1 style="color: dimgrey">Click on the link below to confirm your email address</h1>
                <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/confirm-registration?code=${emailAndCode.confirmationCode}\"> Push to confirm. /registration-confirmation?code=${emailAndCode.confirmationCode}</a></div>`,
        context: {
          // ✏️ filling curly brackets with content
          name: emailAndCode.createdAt,
          url,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // async sendCodeByRegistration(emailAndCode: EmailConfirmCodeType) {
  //   try {
  //     await this.mailerService.sendMail({
  //       to: emailAndCode.email,
  //       from: 'Email confirmation message <process.env.NODEMAILER_EMAIL>',
  //       subject: 'Registration by confirmation code',
  //       html: `
  //     <h1 style="color: dimgrey">Click on the link below to confirm your email address</h1>
  //      <div><a style="font-size: 20px; text-decoration-line: underline" href=\"https://it-express-api.herokuapp.com/auth/confirm-registration?code=${emailAndCode.confirmationCode}\"> Push to confirm. /registration-confirmation?code=${emailAndCode.confirmationCode}</a></div>
  //     `,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // async sendUserConfirmation(emailAndCode: EmailConfirmCodeType) {
  //   const url = `https://it-express-api.herokuapp.com/auth/confirm-registration?code=${emailAndCode.confirmationCode}`;
  //
  //   await this.mailerService.sendMail({
  //     to: emailAndCode.email,
  //     from: 'Email confirmation message <process.env.NODEMAILER_EMAIL>',
  //     subject: 'Welcome to Nice App! Confirm your Email',
  //     template: './confirmation', // `.hbs` extension is appended automatically
  //     context: {
  //       // ✏️ filling curly brackets with content
  //       name: emailAndCode.createdAt,
  //       url,
  //     },
  //   });
  // }
}