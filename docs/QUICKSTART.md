# Quick Start

## Install

```bash
npm install
```

## Configure

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENROUTER_API_KEY=your_key
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get keys:

- OpenRouter: https://openrouter.ai/keys
- Upstash: https://upstash.com

## Run

```bash
npm run dev
```

Open http://localhost:3000

## Test

Click "Try with demo data" - no API keys needed.

## Deploy

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## Troubleshooting

**Module not found**: `npm install`

**API errors**: Check `.env.local` has valid keys

**Commit rejected**: Use conventional commits format

- Example: `feat: add feature` or `fix: bug fix`
- See: https://www.conventionalcommits.org/
