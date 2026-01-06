/**
 * AI Analysis Chains for GitHub Vibe Check
 *
 * We analyze:
 * 1. Commit messages → Developer personality & habits
 * 2. README content → Communication style & project approach
 * 3. Profile stats → Activity level & community engagement
 */

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RepoDetail } from './scraper';

function getLLM() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Please add it to your .env.local file. ' +
        'Get your key from https://openrouter.ai/keys'
    );
  }

  return new ChatOpenAI({
    modelName: 'x-ai/grok-4.1-fast',
    temperature: 0.8, // Higher creativity for personality analysis
    apiKey: apiKey,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'GitHub Vibe Check',
      },
    },
  });
}

export interface DeveloperVibe {
  archetype: string;
  personality: string;
  audit: {
    testing: string; // Analysis of testing culture
    tooling: string; // CI/CD, Docker, etc.
    architecture: string; // Patterns found
  };
  marketRole: string; // Founder-stage, Enterprise Architect, etc.
  growthAdvice: string[]; // Actionable technical tips
  roast: string;
  commitStyle: string;
}

const VIBE_ANALYZER_PROMPT = `You are a Senior System Architect performing a technical audit of a developer's GitHub profile. 
Your goal is to provide a "Signal-Heavy" analysis that actually matters to a Lead Engineer or a CTO.

CONTEXT:
TOP REPOS (Structure, Topics & Hard Signals from Dependencies):
{repoContext}

LATEST COMMITS:
{commits}

README SAMPLES:
{readmes}

PROFILE STATS:
- Repos: {repos}, Followers: {followers}

Analyze and return a JSON object with this structure (ONLY return valid JSON):
{{
  "archetype": "A technical title (e.g., 'Protobuf Purist', 'The Boilerplate Architect', 'Async/Await Maverick')",
  "personality": "Punchy analysis of their engineering philosophy.",
  "audit": {{
    "testing": "Evidence-based analysis of their testing culture (found tests folders? used vitest/jest/playwright? or raw dogging production?)",
    "tooling": "Analysis of DX/Ops maturity (Docker, CI/CD, Monorepos, Task runners like Just/Makefile)",
    "architecture": "Identified patterns (Clean Architecture, Script-first, Event-driven, etc.) based on folder structures"
  }},
  "marketRole": "A role designation like 'Early-Stage Growth Engineer', 'System Stability Specialist', or 'Prototype Specialist'",
  "growthAdvice": ["Advice 1: focusing on specific tech they lack based on their stack", "Advice 2..."],
  "roast": "A high-tier technical roast (e.g., roasting their dependency-bloat, or their lack of tests, or their 2000-line index.js)",
  "commitStyle": "Diagnosis of their git discipline"
}}

Instruction:
- IGNORE FLUFF. Look at the dependencies! If you see 'pnpm', they care about efficiency. If you see 'lodash' everywhere, call it out.
- Be surprisingly observant. If their repo structure is identical to a famous boiler-plate, call them a 'Scaffold Specialist'.
- If the commits are mostly 'chore: update', they are likely a maintenance-heavy coder.
- Return a signal that would make a developer say 'Wait, how did it know that?'`;

export async function analyzeGitHubVibe(
  commits: string[],
  readmes: string[],
  repos: number,
  followers: number,
  repoDetails: RepoDetail[] = []
): Promise<DeveloperVibe> {
  const llm = getLLM();
  const prompt = PromptTemplate.fromTemplate(VIBE_ANALYZER_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  const commitsText = commits.map((c, i) => `${i + 1}. ${c}`).join('\n');
  const readmesText = readmes.join('\n\n---\n\n');
  const repoContextText = repoDetails
    .map(
      (r) =>
        `Repo: ${r.name}\n- Desc: ${r.description}\n- Tech: ${r.languages.join(', ')}\n- Topics: ${r.topics.join(', ')}\n- Files: ${r.structure.join(', ')}\n- Dep Signal: ${r.dependencies || 'none'}`
    )
    .join('\n\n');

  try {
    const result = await chain.invoke({
      repoContext: repoContextText,
      commits: commitsText,
      readmes: readmesText,
      repos: repos.toString(),
      followers: followers.toString(),
    });

    const cleanedResult = result
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResult);

    if (!parsed.archetype || !parsed.personality) {
      throw new Error('Invalid response structure from LLM');
    }

    return parsed as DeveloperVibe;
  } catch (error) {
    console.error('Error analyzing GitHub vibe:', error);

    // Fallback vibe
    return {
      archetype: 'The Mysterious Engineer',
      personality: 'A developer who lets the code speak for itself, often in riddles.',
      audit: {
        testing: 'Inconclusive. Likely relying on manual verification.',
        tooling: 'Standard Git workflow.',
        architecture: 'Script-based or monolithic patterns.',
      },
      marketRole: 'Generalist Software Engineer',
      growthAdvice: [
        'Implement automated CI/CD pipelines',
        'Add comprehensive unit testing',
        'Explore modern dependency management',
      ],
      roast:
        "Your presence on GitHub is like a private repo: we're sure something's there, but we can't see it.",
      commitStyle: 'Minimalist and enigmatic.',
    };
  }
}

/**
 * Generate Sample Code in User's Style
 * (Future feature: Generate code snippets that match their style)
 */
const CODE_GENERATOR_PROMPT = `You are a code generator that mimics a developer's style.

Based on this developer's engineering audit:
- Archetype: {archetype}
- Market Role: {marketRole}
- Architecture: {architecture}
- Commit Style: {commitStyle}

Generate a short, funny code snippet (10-15 lines) that this developer would write.
Include a commit message they would use for this code.

Return ONLY valid JSON:
{{
  "code": "the code snippet as a string with \\n for newlines",
  "language": "javascript/python/etc",
  "commitMessage": "the commit message they'd write"
}}`;

export async function generateCodeSample(vibe: DeveloperVibe): Promise<{
  code: string;
  language: string;
  commitMessage: string;
}> {
  const llm = getLLM();
  const prompt = PromptTemplate.fromTemplate(CODE_GENERATOR_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  try {
    const result = await chain.invoke({
      archetype: vibe.archetype,
      marketRole: vibe.marketRole,
      architecture: vibe.audit.architecture,
      commitStyle: vibe.commitStyle,
    });

    const cleanedResult = result
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleanedResult);
  } catch (error) {
    console.error('Error generating code sample:', error);
    return {
      code: '// TODO: Write actual code\nconsole.log("Hello, World!");',
      language: 'javascript',
      commitMessage: 'feat: add hello world (revolutionary)',
    };
  }
}
