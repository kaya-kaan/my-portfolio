# Deployment Guide

This project is designed to run on a VPS with Docker Compose, Cloudflare Tunnel, and Caddy.

The current production flow is:

`internet -> Cloudflare -> cloudflared -> Caddy -> Next.js app`

Cloudflare remains the public edge. `cloudflared` keeps the origin off the public internet, `Caddy` acts as the origin-side reverse proxy, and the Next.js container remains the application server.

## Services

The current `docker-compose.yml` defines:

- `app`: the standalone Next.js production server
- `caddy`: the origin-side reverse proxy in front of the app
- `cloudflared`: the Cloudflare Tunnel connector that forwards traffic into Caddy

## Before You Deploy

1. Provision a Linux VPS with Docker Engine and the Docker Compose plugin installed.
2. Clone this repository onto the server.
3. Create a production environment file:

```bash
cp .env.production.example .env.production
```

4. Set the required environment variables in `.env.production`.

At minimum, you should define:

- `DOMAIN`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `EMAIL_TO`
- `TUNNEL_TOKEN`

Optional:

- `EMAIL_FROM`
- `SITE_URL`

## Cloudflare Tunnel Setup

Before starting the stack, create a Cloudflare Tunnel in your Cloudflare account and obtain a tunnel token.

Important: after this repo change, the Cloudflare Tunnel origin must point to Caddy instead of the app container directly.

The origin service should now be:

```text
http://caddy:80
```

If your existing tunnel is still pointing at `http://app:3000`, update that in the Cloudflare Zero Trust tunnel configuration before or immediately after redeploying.

Store the token returned by Cloudflare as:

```env
TUNNEL_TOKEN=your_tunnel_token_here
```

## Start The Stack

Build and start the containers:

```bash
docker compose --env-file .env.production up -d --build
```

## Verify

Check container status:

```bash
docker compose ps
```

Check the app logs:

```bash
docker compose logs -f app
```

Check the Caddy access and proxy logs:

```bash
docker compose logs -f caddy
```

Check the tunnel logs:

```bash
docker compose logs -f cloudflared
```

Once the tunnel is healthy and DNS is configured in Cloudflare, visit your domain and confirm the site loads correctly.

## Logging Model

This stack now has two useful logging layers:

- `app` logs: application events such as contact form validation, rate limiting, and email delivery
- `caddy` logs: origin-side HTTP access logs for all requests that reach the VPS

Docker log rotation is configured in `docker-compose.yml` so logs do not grow without bound on the server.

## Operational Notes

- The app listens on port `3000` inside the Docker network.
- Caddy listens on port `80` inside the Docker network and reverse proxies to `app:3000`.
- `cloudflared` should forward tunnel traffic to `caddy:80`.
- The canonical site URL, Open Graph URLs, `robots.txt`, and `sitemap.xml` depend on the configured site URL environment variables.
- The contact form requires valid Resend configuration in production.

## Common Checks

If the site does not load:

- confirm the tunnel token is valid
- confirm the Cloudflare Tunnel origin is `http://caddy:80`
- confirm the `caddy` container is running
- confirm the `app` container is running
- inspect `docker compose logs -f cloudflared`
- inspect `docker compose logs -f caddy`
- inspect `docker compose logs -f app`

If the contact form fails:

- confirm `RESEND_API_KEY` is valid
- confirm `EMAIL_TO` is set
- confirm `EMAIL_FROM` is valid for your verified sending domain if you are no longer using the Resend onboarding sender
- inspect both `app` and `caddy` logs to distinguish application failures from request-routing issues
