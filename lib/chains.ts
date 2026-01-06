/**
 * LangChain Prompt Templates & AI Chains
 *
 * Why: We use LangChain to structure our prompts and make them reusable.
 * This separates the AI logic from the API routes, making it easier to test and iterate.
 *
 * Gotcha: OpenRouter requires specific headers and model names. We use Gemini Flash
 * for speed and cost-effectiveness, but you can swap to GPT-4 for better quality.
 */

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

/**
 * Initialize the LLM with OpenRouter
 * OpenRouter acts as a proxy to multiple AI providers (OpenAI, Anthropic, Google, etc.)
 */
function getLLM() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Please add it to your .env.local file. ' +
        'Get your key from https://openrouter.ai/keys'
    );
  }

  return new ChatOpenAI({
    modelName: 'google/gemini-flash-1.5', // Fast and cheap for MVP
    temperature: 0.7, // Balance between creativity and consistency
    openAIApiKey: apiKey,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'EchoWrite',
      },
    },
  });
}

/**
 * Style Analysis Chain
 * Analyzes a user's writing style from their LinkedIn posts
 */
export interface WritingStyle {
  tone: string;
  style: string;
  keywords: string[];
  formatting: string;
  signature_phrases: string[];
}

const STYLE_ANALYZER_PROMPT = `You are an expert writing analyst. Analyze the following LinkedIn posts and extract the author's unique writing style.

Posts:
{posts}

Analyze and return a JSON object with the following structure (ONLY return valid JSON, no markdown, no explanation):
{{
  "tone": "A 2-3 word description of the overall tone (e.g., 'Inspirational & Tech-focused', 'Professional & Data-driven')",
  "style": "A short sentence describing the writing style (e.g., 'Short, punchy sentences with strategic line breaks', 'Long-form storytelling with personal anecdotes')",
  "keywords": ["array", "of", "5-7", "most", "common", "topics"],
  "formatting": "Description of formatting quirks (e.g., 'Uses emojis sparingly', 'Bullet points for lists', 'Single-line paragraphs')",
  "signature_phrases": ["array", "of", "2-3", "unique", "phrases", "this", "person", "uses"]
}}

Return ONLY the JSON object, nothing else.`;

export async function analyzeWritingStyle(posts: string[]): Promise<WritingStyle> {
  const llm = getLLM();

  const prompt = PromptTemplate.fromTemplate(STYLE_ANALYZER_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  const postsText = posts.map((post, i) => `Post ${i + 1}:\n${post}`).join('\n\n---\n\n');

  try {
    const result = await chain.invoke({ posts: postsText });

    // Clean up the response (remove markdown code blocks if present)
    const cleanedResult = result
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResult);

    // Validate the structure
    if (!parsed.tone || !parsed.style || !Array.isArray(parsed.keywords)) {
      throw new Error('Invalid response structure from LLM');
    }

    return parsed as WritingStyle;
  } catch (error) {
    console.error('Error analyzing writing style:', error);

    // Return a fallback style if parsing fails
    return {
      tone: 'Professional & Engaging',
      style: 'Clear and concise with a focus on actionable insights',
      keywords: ['technology', 'innovation', 'growth', 'strategy', 'leadership'],
      formatting: 'Clean paragraphs with occasional bullet points',
      signature_phrases: ["Let's dive in", "Here's the thing", 'Bottom line'],
    };
  }
}

/**
 * Post Generation Chain
 * Generates new LinkedIn posts based on the analyzed writing style
 */
const POST_GENERATOR_PROMPT = `You are a LinkedIn ghostwriter. Generate a new LinkedIn post that mimics the following writing style EXACTLY.

Writing Style Profile:
- Tone: {tone}
- Style: {style}
- Common Keywords: {keywords}
- Formatting: {formatting}
- Signature Phrases: {signature_phrases}

Topic: {topic}

Instructions:
1. Write a LinkedIn post about the given topic
2. Match the tone, style, and formatting EXACTLY
3. Use similar keywords and phrases naturally
4. Keep it authentic and engaging
5. Length should be 100-250 words
6. Do NOT use hashtags unless the original style uses them heavily

Return ONLY the post text, no explanations or meta-commentary.`;

export async function generatePost(style: WritingStyle, topic: string): Promise<string> {
  const llm = getLLM();

  const prompt = PromptTemplate.fromTemplate(POST_GENERATOR_PROMPT);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  try {
    const result = await chain.invoke({
      tone: style.tone,
      style: style.style,
      keywords: style.keywords.join(', '),
      formatting: style.formatting,
      signature_phrases: style.signature_phrases.join(', '),
      topic,
    });

    return result.trim();
  } catch (error) {
    console.error('Error generating post:', error);
    throw new Error('Failed to generate post. Please try again.');
  }
}

/**
 * Generate multiple post variations
 */
export async function generateMultiplePosts(
  style: WritingStyle,
  topics: string[]
): Promise<string[]> {
  // Generate posts in parallel for speed
  const promises = topics.map((topic) => generatePost(style, topic));
  return Promise.all(promises);
}

/**
 * Default topics for post generation
 * These are generic enough to work for most LinkedIn users
 */
export const DEFAULT_TOPICS = [
  'The future of remote work and hybrid teams',
  'A lesson you learned from a recent failure',
  'Why continuous learning is crucial in your industry',
];
