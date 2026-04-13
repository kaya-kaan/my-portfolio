# kaankaya.dev

Personal portfolio website built with Next.js, TypeScript, and Tailwind CSS.

Live site: [kaankaya.dev](https://kaankaya.dev)

## Overview

This project is a self-hosted portfolio designed to present my work, technical interests, and contact paths in a clean, production-oriented format.

The site includes:

- a responsive single-page portfolio experience
- SEO metadata and structured data
- a server-backed contact form powered by Resend
- a Docker-based deployment setup
- Cloudflare Tunnel support for exposing the app without opening the origin directly
- Caddy as an origin-side reverse proxy with access logging

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS |
| Email | Resend |
| Deployment | Docker Compose + Cloudflare Tunnel + Caddy |

## Features

- Responsive layout for desktop and mobile
- Reusable component structure for sections and navigation
- Theme toggle with persisted preference
- Structured metadata for search and social sharing
- Contact form validation, rate limiting, and email delivery
- Self-hosted deployment flow suitable for a VPS
- Split application and reverse-proxy logging

## Project Structure

```text
src/
  app/
    api/contact/route.ts   # Contact form backend
    layout.tsx             # Global layout and metadata
    page.tsx               # Main page entry
  components/
    HomePage.tsx           # Portfolio page UI
    Navbar.tsx             # Navigation and theme toggle
  lib/
    site.ts                # Site metadata and environment helpers
    theme.ts               # Theme types and storage key
Dockerfile
docker-compose.yml
DEPLOYMENT.md
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
copy .env.production.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

If you want the contact form to work locally, set valid `RESEND_API_KEY`, `EMAIL_TO`, and optionally `EMAIL_FROM` values in `.env.local`.

## Production Notes

- The app is built as a standalone Next.js server via `output: "standalone"`.
- In production, the app is intended to run in Docker behind `cloudflared` and `Caddy`.
- The canonical site URL is derived from `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, or `DOMAIN`.
- The active ingress path is `Cloudflare -> cloudflared -> Caddy -> Next.js app`.

## Deployment

Deployment instructions are documented in `DEPLOYMENT.md`.

## Resume Context

This repo is intentionally simple in product scope, but it reflects several production-minded concerns:

- typed frontend and backend code in one codebase
- environment-driven metadata and deployment behavior
- server-side email handling with validation
- containerized deployment
- tunnel-based origin protection
- origin-side reverse proxying and access logging

## Requirements

- Node.js 20+
- npm
- A Resend account for contact email delivery
- A VPS and Cloudflare Tunnel token for production deployment
