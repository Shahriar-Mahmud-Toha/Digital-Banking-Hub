import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'i******@gmail.com',
        pass: 'kp** **** **** **uz',
    },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'i******@gmail.com', 
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}