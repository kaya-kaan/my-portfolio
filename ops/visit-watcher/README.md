# Visit Watcher

This watcher tails `caddy` logs from the production Docker Compose stack, extracts likely human visits using simple heuristics, and sends alerts through the existing OpenClaw Telegram channel.

## Why this design

- It keeps first-stage filtering deterministic.
- It reuses the OpenClaw + Telegram path you already configured.
- It avoids spreading Telegram bot secrets into another component.
- It is safe to keep in a public repo because runtime secrets stay in a server-only env file.

## What it currently does

- follows `docker compose logs -f caddy`
- filters for likely human page visits
- ignores obvious assets, `_next`, API paths, and common bot user-agents
- dedupes by masked IP + user-agent over a cooldown window
- sends a Telegram alert through `openclaw message send`
- optionally emits an OpenClaw system event for later agent awareness

## Configuration

Copy the example env file contents into a private server-only file such as:

```bash
~/.config/personal-agent/visit-watcher.env
```

Do not commit the real env file.

## Run manually

```bash
cd /home/kaan/my-portfolio
set -a
source ~/.config/personal-agent/visit-watcher.env
set +a
/home/kaan/.openclaw/tools/node/bin/node ops/visit-watcher/index.mjs
```

## Install as a user service

Use the example unit in [visit-watcher.service.example](C:/Users/kaank.KAAN-PC/OneDrive/Masaüstü/projects/my-portfolio/ops/visit-watcher/visit-watcher.service.example).

Suggested flow on the VPS:

```bash
mkdir -p ~/.config/personal-agent
mkdir -p ~/.config/systemd/user
cp /home/kaan/my-portfolio/ops/visit-watcher/visit-watcher.service.example ~/.config/systemd/user/visit-watcher.service
```

Edit the copied unit if your paths differ, then:

```bash
systemctl --user daemon-reload
systemctl --user enable --now visit-watcher.service
systemctl --user status visit-watcher.service
journalctl --user -u visit-watcher.service -f
```

## Future improvements

- move dedupe state to a persistent file outside the repo
- replace direct Telegram alerts with OpenClaw webhook-triggered summarization
- add stronger bot/scanner detection and referrer-based confidence scoring
- emit structured alert history for MCP queries
