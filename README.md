This is a personal portfolio built with [Next.js](https://nextjs.org), React, and Tailwind CSS.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Production build:

```bash
npm run build
```

## Project Notes

- Main app code lives under `src/`
- Production deployment for this repo is documented in `DEPLOYMENT.md`
- The contact form posts to `src/app/api/contact`

## Environment Variables

- `NEXT_PUBLIC_SITE_URL` for canonical metadata, sitemap, and robots output
- `RESEND_API_KEY` for the contact form backend
- `EMAIL_TO` and `EMAIL_FROM` for message delivery

## Deployment

This repository is currently set up for self-hosting with Docker Compose and Caddy. See `DEPLOYMENT.md` for the production setup.
