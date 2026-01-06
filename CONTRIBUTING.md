# Contributing

## Setup

```bash
git clone https://github.com/yourusername/github-vibe-check.git
cd github-vibe-check
npm install
cp .env.example .env.local
# Add your API keys
npm run dev
```

## Commit Guidelines

This project uses Conventional Commits: https://www.conventionalcommits.org/

Format: `<type>: <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

Examples:

```bash
git commit -m "feat: add profile scraping"
git commit -m "fix: resolve rate limit bug"
git commit -m "docs: update readme"
```

## Pre-commit Hooks

Husky runs automatically:

- Formats code (Prettier)
- Lints code (ESLint)
- Validates commit message

If rejected, fix and retry.

## Code Style

- TypeScript for all code
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## Pull Requests

1. Create branch: `feat/feature-name`
2. Make changes
3. Commit (conventional commits)
4. Push and create PR
5. Wait for CI to pass

## CI Checks

GitHub Actions runs:

- ESLint
- TypeScript type check
- Prettier format check
- Build verification
- Commit message validation

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Run linter
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript check
npm run format       # Format code
```

## Questions

Open an issue or check existing documentation.
