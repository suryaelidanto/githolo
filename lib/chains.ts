/**
 * GitHolo AI Analysis Chains
 *
 * We analyze:
 * 1. Commit messages → Developer personality & habits
 * 2. README content → Communication style & project approach
 * 3. Profile stats → Activity level & community engagement
 */

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RepoDetail, RepoSummary } from './scraper';

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
        'X-Title': 'GitHolo',
      },
    },
  });
}

export interface DeveloperIdentity {
  archetype: string;
  personality: string;
  audit: {
    testing: string; // Analysis of testing culture
    tooling: string; // CI/CD, Docker, etc.
    architecture: string; // Patterns found
  };
  stats: {
    power: number; // 0-100 overall impact
    coding: number; // 0-100 logic complexity
    shipSpeed: number; // 0-100 commit frequency/activity
    reliability: number; // 0-100 testing/tooling presence
  };
  marketRole: string; // Founder-stage, Enterprise Architect, etc.
  growthAdvice: string[]; // Actionable technical tips
  roast: string;
  commitStyle: string;
}

const VALID_ARCHETYPES = [
  'The Architect',
  'The SRE',
  'The Sentinel',
  'The Weaver',
  'The Researcher',
  'The Modernizer',
  'The Principal',
  'The Purist',
  'The Automator',
  'The Velocity Lead',
  'The Stabilizer',
  'The Artisan',
  'The Scribe',
  'The Maintainer',
  'The Pilot',
  'The Vanguard',
  'The Oracle',
  'The Optimizer',
  'The Navigator',
  'The Generalist',
];

const IDENTITY_ANALYZER_PROMPT = `You are a Senior System Architect performing a technical audit of a developer's GitHub profile. 
Your goal is to provide a "Signal-Heavy" analysis for a high-end Developer Trading Card.

CONTEXT:
TOP REPOS & DEPENDENCIES:
{repoContext}

REAL CODE SNIPPETS (CRITICAL):
{evidence}

LATEST COMMITS:
{commits}

PROFILE STATS:
- Repos: {repos}, Followers: {followers}

VALID ARCHETYPES (CHOOSE THE BEST MATCHING CLASS):
${VALID_ARCHETYPES.join(', ')}

Analyze and return a JSON object with this structure (ONLY return valid JSON):
{{
  "archetype": "The exact name of one of the valid archetypes provided above.",
  "personality": "Punchy analysis of their engineering philosophy.",
  "audit": {{
    "testing": "Evidence-based analysis of their testing culture.",
    "tooling": "Analysis of DX/Ops maturity (Docker, CI/CD, Monorepos, etc.)",
    "architecture": "Identified patterns based on folder structures and code snippets"
  }},
  "stats": {{
    "power": 0,
    "coding": 0,
    "shipSpeed": 0,
    "reliability": 0
  }},
  "marketRole": "A HYPER-SPECIFIC, unique professional title (e.g., 'High-Concurrency Go Specialist', 'Type-Safe React Architect', 'Rust Memory Safety Extremist'). Be creative and specific to THEIR code.",
  "growthAdvice": ["Advice 1", "Advice 2"],
  "roast": "A high-tier technical roast.",
  "commitStyle": "Diagnosis of their git discipline"
}}

Instruction:
- You MUST select the most fitting archetype from the VALID ARCHETYPES list for the "archetype" field.
- For the "marketRole" field, be extremely specific to the user's actual code signals. Make them feel unique.
- Calculate STATS (0-100) based on signals. 100 Power = high stars/followers. 100 Coding = complex logic. 100 ShipSpeed = high commit frequency. 100 Reliability = tests/CI.
- Use the REAL CODE SNIPPETS to catch their habits (naming, error handling, patterns).
- Be surprisingly observant. If the code is elite, be respectful. If it's a mess, ROAST IT.`;

export async function analyzeGitHubIdentity(
  commits: string[],
  readmes: string[],
  repos: number,
  followers: number,
  repoDetails: RepoDetail[] = [],
  evidenceText: string = ''
): Promise<DeveloperIdentity> {
  const llm = getLLM();
  const prompt = PromptTemplate.fromTemplate(IDENTITY_ANALYZER_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  const commitsText = commits.map((c, i) => `${i + 1}. ${c}`).join('\n');
  const repoContextText = repoDetails
    .map(
      (r) =>
        `Repo: ${r.name}\n- Desc: ${r.description}\n- Tech: ${r.languages.join(', ')}\n- Files: ${r.structure.join(', ')}\n- Dep Signal: ${r.dependencies || 'none'}`
    )
    .join('\n\n');

  try {
    const result = await chain.invoke({
      repoContext: repoContextText,
      evidence: evidenceText || 'No direct code evidence provided.',
      commits: commitsText,
      repos: repos.toString(),
      followers: followers.toString(),
    });

    const cleanedResult = result
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResult);

    if (!parsed.archetype || !parsed.stats) {
      throw new Error('Invalid response structure from LLM');
    }

    return parsed as DeveloperIdentity;
  } catch (error) {
    console.error('Error analyzing GitHub identity:', error);

    // Fallback identity
    return {
      archetype: 'The Mysterious Engineer',
      personality: 'A developer who lets the code speak for itself, often in riddles.',
      audit: {
        testing: 'Inconclusive.',
        tooling: 'Standard Git workflow.',
        architecture: 'Script-based patterns.',
      },
      stats: {
        power: 50,
        coding: 60,
        shipSpeed: 50,
        reliability: 40,
      },
      marketRole: 'Generalist Software Engineer',
      growthAdvice: ['Implement automated CI/CD', 'Add unit testing'],
      roast: 'Your presence on GitHub is like a private repo.',
      commitStyle: 'Minimalist.',
    };
  }
}

const SCOUT_PROMPT = `You are a Technical Headhunter scouting for a developer's "Crown Jewel" repository.
Analyze these repositories and commits to find the ONE repo and 2 specific file paths that best represent their core engineering depth.

REPOS:
{repos}

COMMITS:
{commits}

PROFILE: {bio}

Rules:
1. Ignore forks (look for fork: false).
2. Look for "Heavy" repos (high complexity, business logic, not just config).
3. Select 2 file paths that likely contain significant logic (avoid index, config, types).

Return ONLY valid JSON:
{{
  "thought": "Reasoning for selection",
  "selectedRepo": "full_name of the repo",
  "filePaths": ["path/to/file1.ts", "path/to/file2.ts"]
}}`;

export async function identifyEvidenceTarget(
  repos: RepoSummary[],
  commits: string[],
  bio: string
): Promise<{ selectedRepo: string; filePaths: string[] }> {
  const llm = getLLM();
  const prompt = PromptTemplate.fromTemplate(SCOUT_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  const reposText = repos
    .map(
      (r) =>
        `- ${r.full_name}: ${r.description} (Stars: ${r.stars}, Fork: ${r.fork}, Updated: ${r.updated_at})`
    )
    .join('\n');

  try {
    const result = await chain.invoke({
      repos: reposText,
      commits: commits.join('\n'),
      bio: bio,
    });

    const parsed = JSON.parse(
      result
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
    );
    return {
      selectedRepo: parsed.selectedRepo,
      filePaths: parsed.filePaths || [],
    };
  } catch (error) {
    console.error('Error in Scout Pass:', error);
    return { selectedRepo: '', filePaths: [] };
  }
}

/**
 * Generate Sample Code in User's Style (MIMICKING)
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

export async function generateCodeSample(identity: DeveloperIdentity): Promise<{
  code: string;
  language: string;
  commitMessage: string;
}> {
  const llm = getLLM();
  const prompt = PromptTemplate.fromTemplate(CODE_GENERATOR_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  try {
    const result = await chain.invoke({
      archetype: identity.archetype,
      marketRole: identity.marketRole,
      architecture: identity.audit.architecture,
      commitStyle: identity.commitStyle,
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
