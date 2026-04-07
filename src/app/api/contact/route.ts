import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRateLimited(request: NextRequest) {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  const clientKey = getClientKey(request);
  const existingEntry = rateLimitStore.get(clientKey);

  if (!existingEntry) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (existingEntry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  existingEntry.count += 1;
  rateLimitStore.set(clientKey, existingEntry);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(request)) {
      return NextResponse.json(
        {
          error: 'Too many messages sent recently. Please wait a few minutes and try again.',
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Partial<{
      name: string;
      email: string;
      message: string;
    }>;

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
        { status: 400 }
      );
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
            'Email delivery is unavailable right now. Please reach out directly by email.',
        },
        { status: 503 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const from = EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>';
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message).replace(/\n/g, '<br />');

    const { error } = await resend.emails.send({
      from,
      to: [EMAIL_TO],
      subject: `Portfolio Contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>Portfolio Contact Form</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage}</p>
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
