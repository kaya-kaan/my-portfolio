import type { NextRequest } from "next/server";

type LogLevel = "info" | "warn" | "error";

type RequestLogContext = {
  requestId: string;
  method?: string;
  path?: string;
  ip?: string;
  userAgent?: string;
  cfRay?: string;
  country?: string;
};

type LogEntry = {
  event: string;
  requestId?: string;
  method?: string;
  path?: string;
  status?: number;
  ip?: string;
  userAgent?: string;
  cfRay?: string;
  country?: string;
  meta?: Record<string, unknown>;
};

function compactRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  );
}

function truncateText(value: string | null, maxLength: number) {
  if (!value) {
    return undefined;
  }

  return value.length <= maxLength
    ? value
    : `${value.slice(0, maxLength - 3)}...`;
}

export function maskIpAddress(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const ip = value.trim();

  if (!ip || ip === "unknown") {
    return ip || undefined;
  }

  const ipv4Parts = ip.split(".");
  if (ipv4Parts.length === 4) {
    ipv4Parts[3] = "0";
    return ipv4Parts.join(".");
  }

  if (ip.includes(":")) {
    const visibleSegments = ip.split(":").slice(0, 4).join(":");
    return visibleSegments ? `${visibleSegments}::` : "::";
  }

  return ip;
}

function getClientIp(request: NextRequest) {
  const cloudflareIp = request.headers.get("cf-connecting-ip");
  if (cloudflareIp) {
    return cloudflareIp.trim();
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getRequestId(request: NextRequest) {
  return (
    request.headers.get("x-request-id")?.trim() ||
    request.headers.get("cf-ray")?.trim() ||
    crypto.randomUUID()
  );
}

export function getRequestLogContext(request: NextRequest): RequestLogContext {
  const clientIp = getClientIp(request);

  return {
    requestId: getRequestId(request),
    method: request.method,
    path: request.nextUrl.pathname,
    ip: maskIpAddress(clientIp),
    userAgent: truncateText(request.headers.get("user-agent"), 160),
    cfRay: request.headers.get("cf-ray")?.trim() || undefined,
    country: request.headers.get("cf-ipcountry")?.trim() || undefined,
  };
}

export function serializeError(error: unknown) {
  if (error instanceof Error) {
    return compactRecord({
      name: error.name,
      message: error.message,
    });
  }

  return {
    message: String(error),
  };
}

function writeLog(level: LogLevel, entry: LogEntry) {
  const payload = compactRecord({
    timestamp: new Date().toISOString(),
    level,
    event: entry.event,
    requestId: entry.requestId,
    method: entry.method,
    path: entry.path,
    status: entry.status,
    ip: entry.ip,
    userAgent: entry.userAgent,
    cfRay: entry.cfRay,
    country: entry.country,
    meta: entry.meta ? compactRecord(entry.meta) : undefined,
  });

  const output = JSON.stringify(payload);

  if (level === "error") {
    console.error(output);
    return;
  }

  console.log(output);
}

export const logger = {
  info(entry: LogEntry) {
    writeLog("info", entry);
  },
  warn(entry: LogEntry) {
    writeLog("warn", entry);
  },
  error(entry: LogEntry) {
    writeLog("error", entry);
  },
};
