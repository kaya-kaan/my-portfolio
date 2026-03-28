import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { RESEND_API_KEY, EMAIL_FROM, EMAIL_TO } = process.env;
    if (
      !RESEND_API_KEY ||
      RESEND_API_KEY === 'replace_with_new_resend_api_key' ||
      !EMAIL_TO
    ) {
      return NextResponse.json(
        {
          error:
            'Contact form delivery is not configured yet. Please use the direct email link instead.',
        },
        { status: 503 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const from = EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>';

    const { error } = await resend.emails.send({
      from,
      to: [EMAIL_TO],
      subject: `Portfolio Contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>Portfolio Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Email delivery failed.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully. I will get back to you soon.',
    });
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
