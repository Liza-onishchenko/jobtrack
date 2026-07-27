import { Request, Response } from 'express';
import { transporter } from '../utils/mailer';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export async function sendContactMessage(req: Request, res: Response): Promise<void> {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: 'name, email and message are required' });
    return;
  }

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ message: 'email must be a valid email address' });
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `JobTrack contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: (error as Error).message });
  }
}
