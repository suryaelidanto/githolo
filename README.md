# GitHolo

AI-powered developer personality analysis. Discover your coding archetype based on your GitHub commits.

## Features

- Analyzes your recent GitHub commits
- Extracts your developer personality & coding style
- Generates your unique "Developer Archetype"
- Provides personalized roast & insights
- No login required
- Rate limited (3 per 24h)
- Bold Pitch.com-inspired UI

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- LangChain + OpenRouter (GPT-4o-mini)
- GitHub API
- Upstash Redis (rate limiting)
- Tailwind CSS v4

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
- GitHub Token (optional): https://github.com/settings/tokens

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
