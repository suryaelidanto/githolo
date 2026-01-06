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
  archetype: string; // "The Chaotic Refactorer", "The Documentation Monk", etc.
  personality: string; // Short description
  strengths: string[];
  quirks: string[];
  roast: string; // Funny but accurate roast
  commitStyle: string;
}

const VIBE_ANALYZER_PROMPT = `You are a witty developer psychologist. Analyze this GitHub user's coding personality based on their commits and README content.

COMMIT MESSAGES:
{commits}

README SAMPLES:
{readmes}

PROFILE STATS:
- Public Repos: {repos}
- Followers: {followers}

Analyze and return a JSON object with the following structure (ONLY return valid JSON, no markdown, no explanation):
{{
  "archetype": "A creative 2-4 word title like 'The Chaotic Refactorer' or 'The Documentation Monk'",
  "personality": "A punchy 1-2 sentence description of their coding personality",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "quirks": ["quirk 1", "quirk 2"],
  "roast": "A funny but accurate one-liner roast about their coding habits (keep it playful, not mean)",
  "commitStyle": "Description of their commit message style in 1 sentence"
}}

Make it entertaining, accurate, and shareable. Think of this as their "developer horoscope".`;

export async function analyzeGitHubVibe(
  commits: string[],
  readmes: string[],
  repos: number,
  followers: number
): Promise<DeveloperVibe> {
  const llm = getLLM();
  const prompt = PromptTemplate.fromTemplate(VIBE_ANALYZER_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  const commitsText = commits.map((c, i) => `${i + 1}. ${c}`).join('\n');
  const readmesText = readmes.join('\n\n---\n\n');

  try {
    const result = await chain.invoke({
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
      archetype: 'The Mysterious Coder',
      personality:
        'A developer shrouded in mystery, leaving breadcrumbs of brilliance across the codebase.',
      strengths: ['Problem solving', 'Persistence', 'Adaptability'],
      quirks: ['Commits at 3 AM', 'Loves refactoring'],
      roast: 'Your commit messages are like fortune cookies—vague but oddly inspiring.',
      commitStyle: 'Concise and to the point, like a developer haiku.',
    };
  }
}

/**
 * Generate Sample Code in User's Style
 * (Future feature: Generate code snippets that match their style)
 */
const CODE_GENERATOR_PROMPT = `You are a code generator that mimics a developer's style.

Based on this developer's vibe:
- Archetype: {archetype}
- Commit Style: {commitStyle}
- Quirks: {quirks}

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
      commitStyle: vibe.commitStyle,
      quirks: vibe.quirks.join(', '),
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
