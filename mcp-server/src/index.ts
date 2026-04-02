import { readFile } from "node:fs/promises";
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
    { cwd: repoRoot },
  );

  return stdout.trim() || "Working tree is clean.";
}

async function runDockerComposeStatus() {
  try {
    const { stdout, stderr } = await execFileAsync(
      "docker",
      ["compose", "ps", "--format", "json"],
      { cwd: repoRoot },
    );

    return {
      ok: true,
      stdout: stdout.trim() || "No running services reported.",
      stderr: stderr.trim() || "",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown docker compose error.";

    return {
      ok: false,
      stdout: "",
      stderr: message,
    };
  }
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
      deploymentFiles: z.record(z.boolean()),
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
      status: result.stdout,
      stderr: result.stderr,
    });
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
  async ({ path: requestedPath }) => {
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
  async (uri) => ({
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
  async (uri) => ({
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
  ({ focus }) => ({
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
