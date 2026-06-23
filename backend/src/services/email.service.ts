import { transporter }
from '../config/mail.js';

export class EmailService {

  static async send(
    to: string,
    subject: string,
    html: string
  ) {

    return transporter.sendMail({
      to,
      subject,
      html,

      from:
        process.env.SMTP_USER,
    });

  }

}