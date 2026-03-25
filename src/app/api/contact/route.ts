import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { EMAIL_USER, EMAIL_PASS, EMAIL_TO } = process.env;
    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      return NextResponse.json(
        {
          error:
            'Contact form delivery is not configured yet. Please use the direct email link instead.',
        },
        { status: 503 }
      );
    }

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

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully. I will get back to you soon.',
    });
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
