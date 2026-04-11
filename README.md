# kaankaya.dev

A responsive, production-ready personal portfolio website built with Next.js and TypeScript.

🌐 **Live:** [kaankaya.dev](https://kaankaya.dev)

---

## Quick Start

```bash
git clone https://github.com/kaya-kaan/portfolio
cd portfolio
npm install
cp .env.example .env.local
npm run dev
# Open http://localhost:3000
```

---

## Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Email** | Resend |
| **Deployment** | Docker + Caddy |

---

## Features

- **Responsive design** — mobile-first layout across all screen sizes
- **Modular components** — reusable UI components for consistent styling
- **Contact form** — API validation, rate limiting, and email delivery via Resend
- **Self-hosted** — containerized with Docker, served via Caddy with automatic HTTPS

---

## Project Structure

```
├── app/
│   ├── api/           # Contact form API route
│   ├── components/    # Reusable UI components
│   └── page.tsx       # Main page
├── public/            # Static assets
├── Dockerfile
├── Caddyfile
└── tailwind.config.ts
```

---

## Deployment

The app is containerized with Docker and served via Caddy as a reverse proxy. Caddy handles HTTPS automatically via Let's Encrypt.

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

See `Caddyfile` for reverse proxy configuration.

---

## Requirements

- Node.js 18+
- npm or yarn
- A [Resend](https://resend.com) account for email (free tier available)
