# Contributing

This project defines a developer's identity through high-fidelity "Trading Cards." We seek elite-tier artwork and high-agency code contributions.

## Developer Identity Cards (Design)

The analytical engine is complete. We now require professional visuals for our archetypes.

### Submission Rule

- **Process:** Submit a Pull Request with your asset at `/public/cards/[archetype_name].png`.
- **Quality:** Assets must look professional, consistent, and elite.
- **The Deal:** High quality is accepted. Mediocrity or inconsistency is rejected. No discussions.

### Technical Baseline

- **Ratio:** 1:1 (Square).
- **Format:** Transparent PNG or Solid White Background.
- **Goal:** Visuals that developers would be proud to embed in their GitHub Profile README.

### Archetype Registry

### Archetype Registry

- **Legendary:** The Architect, The SRE, The Sentinel, The Researcher.
- **Epic:** The Weaver, The Modernizer, The Principal, The Purist, The Automator.
- **Rare:** The Velocity Lead, The Stabilizer, The Artisan, The Scribe.
- **Foundational:** The Maintainer, The Pilot, The Vanguard, The Oracle, The Optimizer, The Navigator, The Generalist.

---

## Technical Contributions (Development)

### Setup

```bash
git clone https://github.com/suryaelidanto/githolo.git
cd githolo
npm install
cp .env.example .env.local
# Add your GITHUB_TOKEN and OPENROUTER_API_KEY
npm run dev
```

### Commit Guidelines

This project uses Conventional Commits.
Format: `<type>: <description>`
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

### Code Style

- TypeScript for all code.
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions/Vars: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Pull Requests

1. Create branch: `feat/feature-name` or `fix/bug-name`.
2. Commit using conventional commits.
3. Ensure CI checks (ESLint, Type Check) pass before submission.

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run linter
npm run type-check   # TypeScript check
npm run format       # Format code with Prettier
```
