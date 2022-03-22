import { CONFIG } from '@app/config';
import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SESClient } from '@aws-sdk/client-ses';
import * as aws from '@aws-sdk/client-ses';
import {
  changeMail,
  changePassword,
  confirmMail,
  resetPassword,
} from './templates';

const ses = new SESClient({
  apiVersion: '2010-12-01',
  region: CONFIG.email.ses.region,
  credentials: {
    accessKeyId: CONFIG.email.ses.accessKeyId,
    secretAccessKey: CONFIG.email.ses.secretAccessKey,
  },
});

@Injectable()
export class MailSenderService {
  private transporter: Mail = createTransport({
    SES: { ses, aws },
  });

  private socials: string = CONFIG.project.socials
    .map(
      (social) =>
        `<a href="${social[1]}" style="box-sizing:border-box;color:${CONFIG.theme.color};font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">${social[0]}</a>`,
    )
    .join('');

  private logger = new Logger('MailSenderService');

  async sendVerifyEmailMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const buttonLink = `${CONFIG.project.mailVerificationUrl}?token=${token}`;
    const content = this.transform(confirmMail, {
      name: name,
      link: buttonLink,
    });
    const mailOptions: Mail.Options = {
      from: `${CONFIG.email.name} <${CONFIG.email.from}>`,
      to: email,
      subject: `Welcome to ${CONFIG.project.name} ${name}! Confirm Your Email`,
      html: content,
    };

    return this.sendMail(mailOptions);
  }

  async sendChangeEmailMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const buttonLink = `${CONFIG.project.mailChangeUrl}?token=${token}`;

    const content = this.transform(changeMail, {
      name: name,
      link: buttonLink,
    });

    const mailOptions = {
      from: `"${CONFIG.email.name}" <${CONFIG.email.from}>`,
      to: email,
      subject: `Change Your ${CONFIG.project.name} Account's Email`,
      html: content,
    };

    return this.sendMail(mailOptions);
  }

  async sendResetPasswordMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const buttonLink = `${CONFIG.project.resetPasswordUrl}?token=${token}`;

    const content = this.transform(resetPassword, {
      name: name,
      link: buttonLink,
    });

    const mailOptions = {
      from: `"${CONFIG.email.name}" <${CONFIG.email.from}>`,
      to: email,
      subject: `Reset Your ${CONFIG.project.name} Account's Password`,
      html: content,
    };

    return this.sendMail(mailOptions);
  }

  async sendPasswordChangeInfoMail(
    name: string,
    email: string,
  ): Promise<boolean> {
    const buttonLink = CONFIG.project.homeUrl;
    const content = this.transform(changePassword, {
      name: name,
      link: buttonLink,
    });
    const mailOptions = {
      from: `"${CONFIG.email.name}" <${CONFIG.email.from}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Your ${CONFIG.project.name} Account's Password is Changed`,
      html: content,
    };

    return this.sendMail(mailOptions);
  }

  private transform(content: string, option?: ContentOption) {
    return content
      .replace(new RegExp('--PersonName--', 'g'), option?.name ?? '')
      .replace(new RegExp('--ProjectName--', 'g'), CONFIG.project.name)
      .replace(new RegExp('--ProjectAddress--', 'g'), CONFIG.project.address)
      .replace(new RegExp('--ProjectLogo--', 'g'), CONFIG.project.logoUrl)
      .replace(new RegExp('--ProjectSlogan--', 'g'), CONFIG.project.slogan)
      .replace(new RegExp('--ProjectColor--', 'g'), CONFIG.theme.color)
      .replace(new RegExp('--ProjectLink--', 'g'), CONFIG.project.homeUrl)
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), option?.link ?? '#')
      .replace(
        new RegExp('--TermsOfServiceLink--', 'g'),
        CONFIG.project.termsOfServiceUrl,
      );
  }

  private sendMail(mailOptions: Mail.Options) {
    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn('Mail sending failed, check your config.');
          resolve(false);
        }
        resolve(true);
      }),
    );
  }
}

interface ContentOption {
  name?: string;
  link?: string;
}
