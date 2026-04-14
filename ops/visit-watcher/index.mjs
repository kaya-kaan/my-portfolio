import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "..", "..");
const defaultEnvFilePath = path.join(repoRoot, ".env.production");
const defaultComposeArgs = ["compose"];
const defaultOpenClawBin = process.env.OPENCLAW_BIN ?? "openclaw";
const alertCooldownMs = Number.parseInt(
  process.env.ALERT_COOLDOWN_MS ?? `${15 * 60 * 1000}`,
  10,
);
const initialBackoffMs = 2_000;
const maxBackoffMs = 60_000;
const assetRequestPattern =
  /\.(?:avif|bmp|css|eot|gif|ico|jpeg|jpg|js|json|map|mjs|mp4|otf|pdf|png|svg|ttf|txt|webm|webmanifest|webp|woff2?|xml)$/i;
const botUserAgentPattern =
  /\b(bot|crawler|spider|headless|lighthouse|curl|wget|python|go-http-client|monitor|uptime|check|scanner|fetch|slurp|preview|facebookexternalhit|bingpreview)\b/i;
const ignoredPathPrefixes = [
  "/_next",
  "/api",
  "/favicon",
  "/robots.txt",
  "/sitemap",
  "/apple-touch-icon",
];
const recentVisitorCache = new Map();

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const config = {
  repoRoot: process.env.PORTFOLIO_REPO_DIR ?? repoRoot,
  envFilePath: process.env.COMPOSE_ENV_FILE ?? defaultEnvFilePath,
  caddyServiceName: process.env.CADDY_SERVICE_NAME ?? "caddy",
  openclawBin: defaultOpenClawBin,
  openclawChannel: process.env.OPENCLAW_CHANNEL ?? "telegram",
  openclawTarget: requiredEnv("OPENCLAW_TARGET"),
  openclawSystemEventMode:
    process.env.OPENCLAW_SYSTEM_EVENT_MODE ?? "next-heartbeat",
  visitStatusMin: Number.parseInt(process.env.VISIT_STATUS_MIN ?? "200", 10),
  visitStatusMax: Number.parseInt(process.env.VISIT_STATUS_MAX ?? "399", 10),
  alertCooldownMs,
  caddyTail: Number.parseInt(process.env.CADDY_TAIL ?? "0", 10),
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function timestamp() {
  return new Date().toISOString();
}

function log(level, message, meta = {}) {
  const payload = {
    timestamp: timestamp(),
    level,
    message,
    ...meta,
  };

  console.log(JSON.stringify(payload));
}

function parseJsonLine(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function getHeaderValue(headers, name) {
  const value = headers?.[name];

  if (Array.isArray(value)) {
    const firstValue = value[0];
    return typeof firstValue === "string" ? firstValue : null;
  }

  return typeof value === "string" ? value : null;
}

function getClientIp(request, headers) {
  if (typeof request?.client_ip === "string" && request.client_ip) {
    return request.client_ip;
  }

  const cloudflareIp = getHeaderValue(headers, "Cf-Connecting-Ip");
  if (cloudflareIp) {
    return cloudflareIp;
  }

  if (typeof request?.remote_ip === "string" && request.remote_ip) {
    return request.remote_ip;
  }

  return "";
}

function getPathName(uri) {
  try {
    return new URL(uri, "http://localhost").pathname;
  } catch {
    return uri.split("?")[0] ?? uri;
  }
}

function sanitizeReferrer(referrer) {
  if (!referrer) {
    return null;
  }

  try {
    const url = new URL(referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return referrer.split("?")[0] ?? referrer;
  }
}

function maskIpAddress(ipAddress) {
  if (!ipAddress) {
    return "unknown";
  }

  if (ipAddress.includes(".")) {
    const octets = ipAddress.split(".");

    if (octets.length === 4) {
      return `${octets[0]}.${octets[1]}.${octets[2]}.0`;
    }
  }

  if (ipAddress.includes(":")) {
    const segments = ipAddress.split(":");
    return `${segments.slice(0, 4).join(":")}:0000:0000:0000:0000`;
  }

  return ipAddress;
}

function summarizeBrowser(userAgent) {
  if (/Edg\//i.test(userAgent)) {
    return "Edge";
  }

  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) {
    return "Chrome";
  }

  if (/Firefox\//i.test(userAgent)) {
    return "Firefox";
  }

  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) {
    return "Safari";
  }

  return "Browser";
}

function summarizePlatform(userAgent) {
  if (/Windows/i.test(userAgent)) {
    return "Windows";
  }

  if (/Mac OS X|Macintosh/i.test(userAgent)) {
    return "macOS";
  }

  if (/Android/i.test(userAgent)) {
    return "Android";
  }

  if (/iPhone|iPad|iOS/i.test(userAgent)) {
    return "iOS";
  }

  if (/Linux/i.test(userAgent)) {
    return "Linux";
  }

  return "Unknown OS";
}

function extractVisitCandidate(entry) {
  const request =
    typeof entry.request === "object" && entry.request !== null
      ? entry.request
      : null;

  if (!request) {
    return null;
  }

  const method = typeof request.method === "string" ? request.method : "";
  const uri = typeof request.uri === "string" ? request.uri : "";
  const pathName = getPathName(uri);
  const status = typeof entry.status === "number" ? entry.status : 0;

  if (method !== "GET" || !pathName || assetRequestPattern.test(pathName)) {
    return null;
  }

  if (
    ignoredPathPrefixes.some((prefix) => pathName.startsWith(prefix)) ||
    status < config.visitStatusMin ||
    status > config.visitStatusMax
  ) {
    return null;
  }

  const headers =
    typeof request.headers === "object" && request.headers !== null
      ? request.headers
      : {};
  const userAgent = getHeaderValue(headers, "User-Agent") ?? "";

  if (!userAgent || botUserAgentPattern.test(userAgent)) {
    return null;
  }

  const accept = getHeaderValue(headers, "Accept") ?? "";
  const secFetchDest = getHeaderValue(headers, "Sec-Fetch-Dest") ?? "";

  if (!accept.includes("text/html") && secFetchDest !== "document") {
    return null;
  }

  const maskedIp = maskIpAddress(getClientIp(request, headers));
  const referrer = getHeaderValue(headers, "Referer");
  const country = getHeaderValue(headers, "Cf-Ipcountry");
  const timestampValue =
    typeof entry.ts === "number"
      ? new Date(entry.ts * 1000)
      : new Date(timestamp());

  return {
    dedupeKey: `${maskedIp}|${userAgent}`,
    timestamp: timestampValue.toISOString(),
    path: pathName,
    status,
    ip: maskedIp,
    userAgent,
    browser: summarizeBrowser(userAgent),
    platform: summarizePlatform(userAgent),
    referrer: sanitizeReferrer(referrer),
    country,
  };
}

function shouldAlert(candidate) {
  const lastSeenAt = recentVisitorCache.get(candidate.dedupeKey);

  if (!lastSeenAt) {
    recentVisitorCache.set(candidate.dedupeKey, Date.now());
    return true;
  }

  const now = Date.now();

  if (now - lastSeenAt >= config.alertCooldownMs) {
    recentVisitorCache.set(candidate.dedupeKey, now);
    return true;
  }

  return false;
}

function buildAlertMessage(candidate) {
  const lines = [
    "Likely human visit detected",
    `Path: ${candidate.path}`,
    `IP: ${candidate.ip}`,
    `Client: ${candidate.browser} on ${candidate.platform}`,
    `Status: ${candidate.status}`,
  ];

  if (candidate.country) {
    lines.push(`Country: ${candidate.country}`);
  }

  if (candidate.referrer) {
    lines.push(`Referrer: ${candidate.referrer}`);
  }

  lines.push(`Time: ${candidate.timestamp}`);

  return lines.join("\n");
}

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `Command failed (${command}): ${stderr || stdout}`,
        ),
      );
    });
  });
}

async function notifyOpenClaw(candidate) {
  const message = buildAlertMessage(candidate);

  await runCommand(config.openclawBin, [
    "message",
    "send",
    "--channel",
    config.openclawChannel,
    "--target",
    config.openclawTarget,
    "--message",
    message,
  ]);

  if (config.openclawSystemEventMode !== "off") {
    try {
      await runCommand(config.openclawBin, [
        "system",
        "event",
        "--mode",
        config.openclawSystemEventMode,
        "--text",
        message,
      ]);
    } catch (error) {
      log("warn", "visit_system_event_failed", {
        path: candidate.path,
        ip: candidate.ip,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

async function getComposeCommandArgs() {
  const args = [...defaultComposeArgs];

  if (await fileExists(config.envFilePath)) {
    args.push("--env-file", path.basename(config.envFilePath));
  }

  args.push(
    "logs",
    "--follow",
    "--no-log-prefix",
    "--tail",
    String(config.caddyTail),
    config.caddyServiceName,
  );

  return args;
}

async function streamCaddyLogs() {
  const composeArgs = await getComposeCommandArgs();
  const child = spawn("docker", composeArgs, {
    cwd: config.repoRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const logReader = createInterface({ input: child.stdout });
  const errorReader = createInterface({ input: child.stderr });

  errorReader.on("line", (line) => {
    if (!line.trim()) {
      return;
    }

    log("warn", "watcher_stderr", { line });
  });

  for await (const line of logReader) {
    const entry = parseJsonLine(line);

    if (!entry) {
      continue;
    }

    const candidate = extractVisitCandidate(entry);

    if (!candidate || !shouldAlert(candidate)) {
      continue;
    }

    log("info", "visit_candidate_detected", {
      path: candidate.path,
      ip: candidate.ip,
      country: candidate.country,
      referrer: candidate.referrer,
      browser: candidate.browser,
      platform: candidate.platform,
    });

    try {
      await notifyOpenClaw(candidate);
      log("info", "visit_alert_sent", {
        path: candidate.path,
        ip: candidate.ip,
      });
    } catch (error) {
      log("error", "visit_alert_failed", {
        path: candidate.path,
        ip: candidate.ip,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `docker ${composeArgs.join(" ")} exited with status ${code ?? "null"}`,
        ),
      );
    });
  });
}

async function main() {
  log("info", "visit_watcher_starting", {
    repoRoot: config.repoRoot,
    caddyServiceName: config.caddyServiceName,
    openclawChannel: config.openclawChannel,
    openclawSystemEventMode: config.openclawSystemEventMode,
    alertCooldownMs: config.alertCooldownMs,
  });

  let backoffMs = initialBackoffMs;

  while (true) {
    try {
      await streamCaddyLogs();
      backoffMs = initialBackoffMs;
    } catch (error) {
      log("error", "visit_watcher_stream_failed", {
        error: error instanceof Error ? error.message : String(error),
        retryInMs: backoffMs,
      });
      await sleep(backoffMs);
      backoffMs = Math.min(backoffMs * 2, maxBackoffMs);
    }
  }
}

main().catch((error) => {
  log("error", "visit_watcher_fatal", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
