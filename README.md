# kaankaya.dev

Personal portfolio website and self-hosted ops playground built around `Next.js`, `Docker Compose`, `Cloudflare Tunnel`, `Caddy`, and an AI-assisted monitoring layer.

Live site: [kaankaya.dev](https://kaankaya.dev)

## Overview

This repository contains two related parts:

1. the public portfolio site
2. the operational tooling around that site

The website is a self-hosted Next.js portfolio deployed behind `Cloudflare Tunnel` and `Caddy`.  
The ops layer adds structured server-side logging, a small read-only MCP server for live inspection, and a host-side visit watcher that can alert through an existing `OpenClaw + Telegram` setup.

This repo is intentionally broader than a typical portfolio. The goal is not only to present projects, but also to show production-minded infrastructure work around deployment, observability, and automation.

## Current Architecture

```text
Internet
  -> Cloudflare
  -> cloudflared
  -> Caddy
  -> Next.js app
```

Operationally, the stack also includes:

- structured application logs from the Next.js app
- JSON access logs from Caddy
- a read-only MCP server for health, repo, and deployment inspection
- a visit watcher that tails Caddy logs and sends likely-human visit alerts through OpenClaw

## What This Repo Includes

### Website

- responsive portfolio UI
- theme toggle
- SEO metadata and sitemap/robots support
- server-side contact form route with validation, rate limiting, and Resend delivery

### Deployment

- containerized Next.js app
- origin-side reverse proxy with Caddy
- Cloudflare Tunnel ingress
- Docker log rotation

### Observability and Ops

- structured JSON logging for the contact API
- request IDs and Cloudflare-aware client context
- read-only MCP server for:
  - system health
  - Docker Compose status
  - repo status
  - selected file reads
  - recent Caddy/app logs
  - likely visit candidates
  - env-key presence checks without exposing secret values
- visit watcher for likely-human traffic alerts

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS |
| Email | Resend |
| Reverse Proxy | Caddy |
| Ingress | Cloudflare Tunnel (`cloudflared`) |
| Runtime | Docker Compose |
| Ops Agent | OpenClaw (installed separately on VPS) |
| Agent Integrations | Telegram, custom MCP server |

## Project Structure

```text
src/
  app/
    api/contact/route.ts     # Contact form backend + structured app logging
    layout.tsx               # Global layout and metadata
    page.tsx                 # Main page entry
  components/
    HomePage.tsx             # Portfolio page UI
    Navbar.tsx               # Navigation and theme toggle
  lib/
    server/logger.ts         # Structured request/event logging helpers
    site.ts                  # Metadata and URL helpers

mcp-server/
  src/index.ts               # Read-only MCP server for live inspection

ops/
  visit-watcher/
    index.mjs                # Likely-human visit watcher
    visit-watcher.env.example
    visit-watcher.service.example

Dockerfile
docker-compose.yml
Caddyfile
DEPLOYMENT.md
```

## Local Development

### Website

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.production.example .env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.production.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

If you want the contact form to work locally, set valid `RESEND_API_KEY`, `EMAIL_TO`, and optionally `EMAIL_FROM` values in `.env.local`.

### MCP Server

The MCP server is a separate subproject inside this repo.

```bash
cd mcp-server
npm install
npm run build
npm run dev
```

It is designed to run over stdio from an MCP-capable client and inspect this repository safely in read-only mode.

## Production Deployment

The production deployment path is:

`Cloudflare -> cloudflared -> Caddy -> Next.js`

Deployment instructions are in [DEPLOYMENT.md](./DEPLOYMENT.md).

At minimum, production expects:

- `DOMAIN`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `EMAIL_TO`
- `TUNNEL_TOKEN`

Optional:

- `EMAIL_FROM`
- `SITE_URL`

## OpenClaw and Telegram

The repo contains integration points for an `OpenClaw`-based ops workflow, but OpenClaw itself is **not** installed or configured from this repository.

The intended model is:

- this repo contains public-safe code and templates
- OpenClaw runtime, Telegram credentials, and server-only env files stay private on the VPS

Current ops flow:

`Caddy logs -> visit watcher -> OpenClaw -> Telegram`

## Security Notes

- Real env files are not meant to be committed.
- Example env files are included as templates only.
- The watcher uses a server-only env file outside the repo for runtime configuration.
- MCP tools are intentionally read-only in this version.
- Access logs and alerts use masked IPs, but they still process visitor metadata and should be treated accordingly.

## Resume Context

This repository is meant to demonstrate more than frontend work. It shows:

- self-hosted deployment behind Cloudflare Tunnel
- reverse-proxy and application-level logging
- structured backend observability
- containerized production workflow
- custom MCP integration for live repo/server inspection
- AI-assisted operational alerting through OpenClaw and Telegram

## Requirements

- Node.js 20+ for the website
- npm
- Docker Engine + Docker Compose plugin for production
- Cloudflare Tunnel token for production ingress
- Resend account for email delivery
- OpenClaw installed separately if you want the Telegram/MCP/visit-watcher workflow
