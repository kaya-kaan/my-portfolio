import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a transporter if environment variables are provided
    const { EMAIL_USER, EMAIL_PASS, EMAIL_TO } = process.env;
    if (EMAIL_USER && EMAIL_PASS && EMAIL_TO) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: EMAIL_USER,
        to: EMAIL_TO,
        subject: `Portfolio Contact from ${name}`,
        text: message,
        replyTo: email,
      });
    } else {
      console.log('Contact form submission:', { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}