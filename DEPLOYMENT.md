# Deployment Guide

This project is set up for self-hosting on a VPS with Docker Compose and Caddy.

## Repo Files

- `Dockerfile`: builds and runs the Next.js app
- `docker-compose.yml`: runs the app container and Caddy
- `Caddyfile`: reverse proxies traffic to the app and handles HTTPS
- `.env.production.example`: production environment variable template

## Before You Deploy

1. Copy `.env.production.example` to `.env.production`.
2. Fill in:
   - `DOMAIN`
   - `RESEND_API_KEY`
   - `EMAIL_TO`
   - `EMAIL_FROM` once your sending domain is verified

## VPS Setup

1. Provision an Ubuntu VPS.
2. Install Docker Engine and the Docker Compose plugin.
3. Clone this repository on the server.
4. Create `.env.production` from the example file.

## Start The Stack

```bash
docker compose up -d --build
```

## Verify

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f caddy
```

Visit your domain once DNS points at the VPS.

## Notes

- Caddy will handle HTTPS automatically once the domain points to the server.
- The app listens on port `3000` internally and is only exposed through Caddy.
- `output: "standalone"` is enabled in `next.config.ts` to keep the runtime image leaner.
