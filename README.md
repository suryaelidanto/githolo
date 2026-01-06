# EchoWrite

Find your AI voice. Analyze LinkedIn writing style and generate posts that sound like you.

## Features

- Analyzes your last 5 LinkedIn posts
- Extracts your unique writing style
- Generates 3 new posts matching your tone
- No login required
- Rate limited (3 per 24h)
- Dark mode UI with animations

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- LangChain + OpenRouter
- Upstash Redis
- Tailwind + Shadcn/UI

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Get API keys:

- OpenRouter: https://openrouter.ai/keys
- Upstash: https://upstash.com

## Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Development

This project uses Conventional Commits and pre-commit hooks.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Deploy

```bash
vercel
```

## License

MIT
