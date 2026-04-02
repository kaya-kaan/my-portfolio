# Portfolio MCP Server

This is a small read-only MCP server for the portfolio repository.

It exposes:

- tools for repo status, system health, Docker Compose status, and reading key project files
- resources for portfolio overview and SEO-related file inventory
- a reusable prompt for reviewing the portfolio site

## Scripts

```bash
npm install
npm run build
npm run dev
```

## Suggested first use

Connect this server over stdio from an MCP-capable client and start with:

- `get_portfolio_overview`
- `get_repo_status`
- `get_system_health`
- `get_compose_status`
- `read_project_file`

## Notes

- This first version is intentionally read-only.
- It is designed to live beside the portfolio app and inspect the repo safely.
- If you want remote VPS access later, the next step is adding a Streamable HTTP transport in front of the same tool/resource layer.
