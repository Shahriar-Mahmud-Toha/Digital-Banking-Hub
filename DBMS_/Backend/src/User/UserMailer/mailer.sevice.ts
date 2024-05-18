import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
 
@Injectable()
export class UserEmailService {
  private transporter;
 
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'if*******lc@gmail.com',
        pass: 'kp** **** **uz',
    },
    });
  }
 
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'if*******lc@gmail.com',
      to,
      subject,
      text,
    };
 
    await this.transporter.sendMail(mailOptions);
  }
}