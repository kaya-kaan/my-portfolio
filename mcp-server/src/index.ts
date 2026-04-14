import { access, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const execFileAsync = promisify(execFile);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(currentDir, "..");
const repoRoot = path.resolve(serverRoot, "..");
const productionEnvRelativePath = ".env.production";
const productionEnvPath = path.join(repoRoot, productionEnvRelativePath);
const productionEnvExamplePath = path.join(repoRoot, ".env.production.example");
const serviceNames = ["app", "caddy", "cloudflared"] as const;
const logLineCountSchema = z.number().int().min(1).max(200).default(50);
const visitCandidateLineCountSchema = z.number().int().min(20).max(400).default(200);
const visitCandidateLimitSchema = z.number().int().min(1).max(50).default(10);
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
] as const;

const readableFilePaths = [
  "package.json",
  "Dockerfile",
  "docker-compose.yml",
  "Caddyfile",
  "DEPLOYMENT.md",
  "src/lib/site.ts",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/components/HomePage.tsx",
  "src/components/Navbar.tsx",
] as const;

const readableFiles: Record<
  (typeof readableFilePaths)[number],
  (typeof readableFilePaths)[number]
> = {
  "package.json": "package.json",
  "Dockerfile": "Dockerfile",
  "docker-compose.yml": "docker-compose.yml",
  "Caddyfile": "Caddyfile",
  "DEPLOYMENT.md": "DEPLOYMENT.md",
  "src/lib/site.ts": "src/lib/site.ts",
  "src/app/layout.tsx": "src/app/layout.tsx",
  "src/app/page.tsx": "src/app/page.tsx",
  "src/app/robots.ts": "src/app/robots.ts",
  "src/app/sitemap.ts": "src/app/sitemap.ts",
  "src/components/HomePage.tsx": "src/components/HomePage.tsx",
  "src/components/Navbar.tsx": "src/components/Navbar.tsx",
};

type Overview = {
  projectName: string;
  version: string;
  scripts: string[];
  dependencies: string[];
  devDependencies: string[];
  deploymentFiles: Record<string, boolean>;
  seoFiles: string[];
  mcpServerPath: string;
};

type ServiceName = (typeof serviceNames)[number];

type CommandResult = {
  ok: boolean;
  command: string;
  stdout: string;
  stderr: string;
};

type VisitCandidate = {
  timestamp: string;
  path: string;
  method: string;
  status: number;
  ip: string;
  userAgent: string;
  referrer: string | null;
  country: string | null;
};

type LogInput = {
  lines: number;
};

type VisitCandidateInput = {
  lines: number;
  limit: number;
};

type ReadProjectFileInput = {
  path: (typeof readableFilePaths)[number];
};

type ReviewFocus = "seo" | "deployment" | "content" | "overall";

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readTextFile(relativePath: string) {
  return readFile(path.join(repoRoot, relativePath), "utf8");
}

async function getPackageManifest() {
  const manifest = JSON.parse(await readTextFile("package.json")) as {
    name: string;
    version: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  return manifest;
}

async function getPortfolioOverview(): Promise<Overview> {
  const manifest = await getPackageManifest();

  return {
    projectName: manifest.name,
    version: manifest.version,
    scripts: Object.keys(manifest.scripts ?? {}),
    dependencies: Object.keys(manifest.dependencies ?? {}),
    devDependencies: Object.keys(manifest.devDependencies ?? {}),
    deploymentFiles: {
      dockerfile: true,
      compose: true,
      caddy: true,
      deploymentGuide: true,
    },
    seoFiles: [
      "src/lib/site.ts",
      "src/app/layout.tsx",
      "src/app/page.tsx",
      "src/app/robots.ts",
      "src/app/sitemap.ts",
    ],
    mcpServerPath: "mcp-server/src/index.ts",
  };
}

async function runGitStatus() {
  const { stdout } = await execFileAsync(
    "git",
    ["status", "--short", "--branch"],
    { cwd: repoRoot, maxBuffer: 1024 * 1024 * 4 },
  );

  return stdout.trim() || "Working tree is clean.";
}

async function getDockerComposeBaseArgs() {
  const args = ["compose"];

  if (await fileExists(productionEnvPath)) {
    args.push("--env-file", productionEnvRelativePath);
  }

  return args;
}

async function runDockerComposeCommand(args: string[]): Promise<CommandResult> {
  const dockerArgs = [...(await getDockerComposeBaseArgs()), ...args];
  const command = ["docker", ...dockerArgs].join(" ");

  try {
    const { stdout, stderr } = await execFileAsync("docker", dockerArgs, {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024 * 8,
    });

    return {
      ok: true,
      command,
      stdout: stdout.trim() || "No output reported.",
      stderr: stderr.trim() || "",
    };
  } catch (error) {
    const stderr =
      typeof error === "object" &&
      error !== null &&
      "stderr" in error &&
      typeof error.stderr === "string"
        ? error.stderr.trim()
        : "";
    const stdout =
      typeof error === "object" &&
      error !== null &&
      "stdout" in error &&
      typeof error.stdout === "string"
        ? error.stdout.trim()
        : "";
    const message =
      error instanceof Error ? error.message : "Unknown docker compose error.";

    return {
      ok: false,
      command,
      stdout,
      stderr: stderr || message,
    };
  }
}

async function runDockerComposeStatus() {
  return runDockerComposeCommand(["ps", "--format", "json"]);
}

async function getRecentServiceLogs(service: ServiceName, lines: number) {
  return runDockerComposeCommand([
    "logs",
    "--no-log-prefix",
    "--tail",
    String(lines),
    service,
  ]);
}

function getSystemHealth() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  return {
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    uptimeSeconds: os.uptime(),
    cpuCores: os.cpus().length,
    loadAverage: os.loadavg(),
    totalMemoryMb: Math.round(totalMemory / 1024 / 1024),
    freeMemoryMb: Math.round(freeMemory / 1024 / 1024),
    usedMemoryMb: Math.round((totalMemory - freeMemory) / 1024 / 1024),
  };
}

function parseEnvKeys(contents: string) {
  return contents
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .flatMap((line) => {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/u);
      return match ? [match[1]] : [];
    });
}

async function getPortfolioEnvStatus() {
  const [productionExists, exampleExists] = await Promise.all([
    fileExists(productionEnvPath),
    fileExists(productionEnvExamplePath),
  ]);

  const [productionContents, exampleContents] = await Promise.all([
    productionExists ? readFile(productionEnvPath, "utf8") : Promise.resolve(""),
    exampleExists
      ? readFile(productionEnvExamplePath, "utf8")
      : Promise.resolve(""),
  ]);

  const requiredKeys = [...new Set(parseEnvKeys(exampleContents))].sort();
  const presentKeys = [...new Set(parseEnvKeys(productionContents))].sort();
  const missingKeys = requiredKeys.filter((key) => !presentKeys.includes(key));
  const extraKeys = presentKeys.filter((key) => !requiredKeys.includes(key));

  return {
    productionEnvExists: productionExists,
    productionEnvPath: productionEnvRelativePath,
    exampleEnvExists: exampleExists,
    exampleEnvPath: ".env.production.example",
    requiredKeys,
    presentKeys,
    missingKeys,
    extraKeys,
  };
}

function parseLogEntry(line: string) {
  try {
    return JSON.parse(line) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getHeaderValue(
  headers: Record<string, unknown> | undefined,
  headerName: string,
) {
  const value = headers?.[headerName];

  if (Array.isArray(value)) {
    const firstValue = value[0];
    return typeof firstValue === "string" ? firstValue : null;
  }

  return typeof value === "string" ? value : null;
}

function maskIpAddress(ipAddress: string) {
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

function getRequestPath(uri: string) {
  try {
    return new URL(uri, "http://localhost").pathname;
  } catch {
    return uri.split("?")[0] ?? uri;
  }
}

function isLikelyHumanRequest(entry: Record<string, unknown>) {
  const request =
    typeof entry.request === "object" && entry.request !== null
      ? (entry.request as Record<string, unknown>)
      : null;

  if (!request) {
    return false;
  }

  const method = typeof request.method === "string" ? request.method : "";
  const uri = typeof request.uri === "string" ? request.uri : "";
  const pathName = getRequestPath(uri);

  if (method !== "GET" || !pathName || assetRequestPattern.test(pathName)) {
    return false;
  }

  if (ignoredPathPrefixes.some((prefix) => pathName.startsWith(prefix))) {
    return false;
  }

  const headers =
    typeof request.headers === "object" && request.headers !== null
      ? (request.headers as Record<string, unknown>)
      : undefined;
  const userAgent = getHeaderValue(headers, "User-Agent") ?? "";

  if (!userAgent || botUserAgentPattern.test(userAgent)) {
    return false;
  }

  const accept = getHeaderValue(headers, "Accept") ?? "";
  const secFetchDest = getHeaderValue(headers, "Sec-Fetch-Dest") ?? "";
  return accept.includes("text/html") || secFetchDest === "document";
}

function getTimestampIso(entry: Record<string, unknown>) {
  if (typeof entry.ts === "number") {
    return new Date(entry.ts * 1000).toISOString();
  }

  if (typeof entry.ts === "string") {
    const parsed = new Date(entry.ts);

    if (!Number.isNaN(parsed.valueOf())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

function extractVisitCandidates(logText: string, limit: number) {
  const recentCandidates = new Map<string, VisitCandidate>();

  for (const line of logText.split(/\r?\n/u).reverse()) {
    if (!line.trim()) {
      continue;
    }

    const entry = parseLogEntry(line);

    if (!entry || !isLikelyHumanRequest(entry)) {
      continue;
    }

    const request =
      typeof entry.request === "object" && entry.request !== null
        ? (entry.request as Record<string, unknown>)
        : null;

    if (!request) {
      continue;
    }

    const headers =
      typeof request.headers === "object" && request.headers !== null
        ? (request.headers as Record<string, unknown>)
        : undefined;
    const userAgent = getHeaderValue(headers, "User-Agent") ?? "unknown";
    const uri = typeof request.uri === "string" ? request.uri : "/";
    const maskedIp = maskIpAddress(
      typeof request.remote_ip === "string" ? request.remote_ip : "unknown",
    );
    const dedupeKey = `${maskedIp}|${userAgent}`;

    if (recentCandidates.has(dedupeKey)) {
      continue;
    }

    recentCandidates.set(dedupeKey, {
      timestamp: getTimestampIso(entry),
      path: getRequestPath(uri),
      method: typeof request.method === "string" ? request.method : "GET",
      status: typeof entry.status === "number" ? entry.status : 0,
      ip: maskedIp,
      userAgent,
      referrer: getHeaderValue(headers, "Referer"),
      country: getHeaderValue(headers, "Cf-Ipcountry"),
    });

    if (recentCandidates.size >= limit) {
      break;
    }
  }

  return [...recentCandidates.values()];
}

function asTextResult(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

const server = new McpServer({
  name: "portfolio-mcp-server",
  version: "0.1.0",
});

server.registerTool(
  "get_portfolio_overview",
  {
    title: "Portfolio Overview",
    description: "Return a high-level overview of the portfolio repository.",
    outputSchema: {
      projectName: z.string(),
      version: z.string(),
      scripts: z.array(z.string()),
      dependencies: z.array(z.string()),
      devDependencies: z.array(z.string()),
      deploymentFiles: z.record(z.string(), z.boolean()),
      seoFiles: z.array(z.string()),
      mcpServerPath: z.string(),
    },
  },
  async () => {
    const overview = await getPortfolioOverview();

    return {
      ...asTextResult(overview),
      structuredContent: overview,
    };
  },
);

server.registerTool(
  "get_repo_status",
  {
    title: "Repository Status",
    description: "Return the current git status of the portfolio repository.",
  },
  async () => {
    try {
      return asTextResult({
        status: await runGitStatus(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown git error.";

      return {
        content: [{ type: "text" as const, text: message }],
        isError: true,
      };
    }
  },
);

server.registerTool(
  "get_system_health",
  {
    title: "System Health",
    description: "Report basic host memory, CPU, uptime, and OS information.",
    outputSchema: {
      hostname: z.string(),
      platform: z.string(),
      release: z.string(),
      uptimeSeconds: z.number(),
      cpuCores: z.number(),
      loadAverage: z.array(z.number()),
      totalMemoryMb: z.number(),
      freeMemoryMb: z.number(),
      usedMemoryMb: z.number(),
    },
  },
  async () => {
    const health = getSystemHealth();

    return {
      ...asTextResult(health),
      structuredContent: health,
    };
  },
);

server.registerTool(
  "get_compose_status",
  {
    title: "Docker Compose Status",
    description: "Inspect docker compose service state for the portfolio stack.",
  },
  async () => {
    const result = await runDockerComposeStatus();

    if (!result.ok) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Docker Compose status unavailable: ${result.stderr}`,
          },
        ],
        isError: true,
      };
    }

    return asTextResult({
      command: result.command,
      status: result.stdout,
      stderr: result.stderr,
    });
  },
);

server.registerTool(
  "get_recent_caddy_logs",
  {
    title: "Recent Caddy Logs",
    description:
      "Return recent Caddy container logs from the production portfolio stack.",
    inputSchema: {
      lines: logLineCountSchema,
    },
  },
  async ({ lines }: LogInput) => {
    const result = await getRecentServiceLogs("caddy", lines);

    if (!result.ok) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Caddy logs unavailable: ${result.stderr}`,
          },
        ],
        isError: true,
      };
    }

    return asTextResult({
      command: result.command,
      service: "caddy",
      linesRequested: lines,
      log: result.stdout,
      stderr: result.stderr,
    });
  },
);

server.registerTool(
  "get_recent_app_logs",
  {
    title: "Recent App Logs",
    description:
      "Return recent Next.js application logs from the production portfolio stack.",
    inputSchema: {
      lines: logLineCountSchema,
    },
  },
  async ({ lines }: LogInput) => {
    const result = await getRecentServiceLogs("app", lines);

    if (!result.ok) {
      return {
        content: [
          {
            type: "text" as const,
            text: `App logs unavailable: ${result.stderr}`,
          },
        ],
        isError: true,
      };
    }

    return asTextResult({
      command: result.command,
      service: "app",
      linesRequested: lines,
      log: result.stdout,
      stderr: result.stderr,
    });
  },
);

server.registerTool(
  "get_recent_visit_candidates",
  {
    title: "Recent Visit Candidates",
    description:
      "Extract likely human page visits from recent Caddy access logs using simple heuristics.",
    inputSchema: {
      lines: visitCandidateLineCountSchema,
      limit: visitCandidateLimitSchema,
    },
  },
  async ({ lines, limit }: VisitCandidateInput) => {
    const result = await getRecentServiceLogs("caddy", lines);

    if (!result.ok) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Visit candidates unavailable: ${result.stderr}`,
          },
        ],
        isError: true,
      };
    }

    const candidates = extractVisitCandidates(result.stdout, limit);
    const payload = {
      command: result.command,
      linesInspected: lines,
      candidates,
    };

    return {
      ...asTextResult(payload),
      structuredContent: payload,
    };
  },
);

server.registerTool(
  "get_portfolio_env_status",
  {
    title: "Portfolio Env Status",
    description:
      "Compare .env.production against the tracked example file without exposing secret values.",
  },
  async () => {
    const envStatus = await getPortfolioEnvStatus();

    return {
      ...asTextResult(envStatus),
      structuredContent: envStatus,
    };
  },
);

server.registerTool(
  "read_project_file",
  {
    title: "Read Project File",
    description: "Read an allowlisted project file from the portfolio repository.",
    inputSchema: {
      path: z.enum(readableFilePaths),
    },
  },
  async ({ path: requestedPath }: ReadProjectFileInput) => {
    const relativePath = readableFiles[requestedPath];
    const contents = await readTextFile(relativePath);

    return {
      content: [
        {
          type: "text" as const,
          text: contents,
        },
      ],
    };
  },
);

server.registerResource(
  "portfolio-overview",
  "portfolio://overview",
  {
    title: "Portfolio Overview",
    description: "Reference data about the portfolio repo and deployment stack.",
    mimeType: "application/json",
  },
  async (uri: URL) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(await getPortfolioOverview(), null, 2),
      },
    ],
  }),
);

server.registerResource(
  "portfolio-seo-files",
  "portfolio://seo-files",
  {
    title: "SEO File Inventory",
    description: "List the SEO-related files in the portfolio app.",
    mimeType: "application/json",
  },
  async (uri: URL) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(
          {
            files: [
              "src/lib/site.ts",
              "src/app/layout.tsx",
              "src/app/page.tsx",
              "src/app/robots.ts",
              "src/app/sitemap.ts",
            ],
          },
          null,
          2,
        ),
      },
    ],
  }),
);

server.registerPrompt(
  "review-portfolio",
  {
    title: "Review Portfolio",
    description: "Guide an assistant to review the portfolio repo with MCP data.",
    argsSchema: {
      focus: z
        .enum(["seo", "deployment", "content", "overall"])
        .default("overall"),
    },
  },
  ({ focus }: { focus: ReviewFocus }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text:
            `Review the portfolio project with focus="${focus}". ` +
            "Use the portfolio overview resource, inspect relevant files with read_project_file, " +
            "and call repo/deployment tools before giving conclusions.",
        },
      },
    ],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start the portfolio MCP server.");
  console.error(error);
  process.exit(1);
});
