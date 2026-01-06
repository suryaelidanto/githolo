/**
 * GitHub Profile Scraper
 *
 * Why GitHub over LinkedIn:
 * - Public API with generous rate limits (60 req/hour unauthenticated, 5000 with token)
 * - No bot detection, no Auth Walls, no Error 999 bullshit
 * - Developer-focused = perfect for viral shareability
 */

import axios from 'axios';

export interface GitHubProfile {
  username: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
}

export interface GitHubCommit {
  message: string;
  date: string;
  repo: string;
}

export interface ScrapeResult {
  success: boolean;
  profile?: GitHubProfile;
  commits?: GitHubCommit[];
  readmes?: string[];
  error?: string;
  isMock?: boolean;
}

/**
 * Fetch GitHub Profile Data
 */
async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const token = process.env.GITHUB_TOKEN; // Optional, increases rate limit
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHubVibeCheck',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
  return response.data;
}

/**
 * Fetch Recent Commits from User's Repos
 * Strategy: Get their most recently updated repos, then fetch commits from those
 */
async function fetchRecentCommits(username: string, limit: number = 20): Promise<GitHubCommit[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHubVibeCheck',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  // Get user's recently updated repos (not forks)
  const reposResponse = await axios.get(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=10&type=owner`,
    { headers }
  );

  const commits: GitHubCommit[] = [];

  // Fetch commits from each repo until we have enough
  for (const repo of reposResponse.data) {
    if (commits.length >= limit) break;
    if (repo.fork) continue; // Skip forks

    try {
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${repo.full_name}/commits?author=${username}&per_page=10`,
        { headers }
      );

      for (const commit of commitsResponse.data) {
        if (commits.length >= limit) break;

        // Only take commits with actual messages (not merge commits)
        const message = commit.commit.message;
        if (message && !message.startsWith('Merge ')) {
          commits.push({
            message: message.split('\n')[0], // Take first line only
            date: commit.commit.author.date,
            repo: repo.full_name,
          });
        }
      }
    } catch {
      // Repo might be empty or have issues, skip
      continue;
    }
  }

  return commits;
}

/**
 * Fetch README content from top repos
 */
async function fetchTopReadmes(username: string, limit: number = 3): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHubVibeCheck',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  // Get user's repos sorted by stars
  const reposResponse = await axios.get(
    `https://api.github.com/users/${username}/repos?sort=stars&per_page=${limit}`,
    { headers }
  );

  const readmes: string[] = [];

  for (const repo of reposResponse.data) {
    try {
      const readmeResponse = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/readme`,
        {
          headers: {
            ...headers,
            Accept: 'application/vnd.github.v3.raw', // Get raw markdown
          },
        }
      );

      // Take first 500 chars to avoid token bloat
      const readmeText = readmeResponse.data.substring(0, 500);
      if (readmeText.length > 50) {
        readmes.push(readmeText);
      }
    } catch {
      // Repo might not have README, skip
      continue;
    }
  }

  return readmes;
}

/**
 * Main Scraper Function
 */
export async function scrapeGitHubProfile(username: string): Promise<ScrapeResult> {
  // Demo check
  if (username.toLowerCase() === 'demo') {
    return getMockGitHubData();
  }

  try {
    console.log(`[GitHub Scraper] Fetching profile: ${username}`);

    // Fetch profile first (this is critical)
    const profile = await fetchGitHubProfile(username);

    // Fetch commits and readmes separately (non-blocking)
    let commits: GitHubCommit[] = [];
    let readmes: string[] = [];

    try {
      commits = await fetchRecentCommits(username, 20);
    } catch (_error) {
      console.warn('Failed to fetch commits:', _error);
    }

    try {
      readmes = await fetchTopReadmes(username, 3);
    } catch (_error) {
      console.warn('Failed to fetch readmes:', _error);
    }

    if (commits.length === 0) {
      return {
        success: false,
        error: 'No recent commits found. This user might be inactive or have private repos only.',
      };
    }

    return {
      success: true,
      profile,
      commits,
      readmes,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('GitHub Scraper Error:', errorMessage);

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return {
          success: false,
          error: 'GitHub user not found. Check the username and try again.',
        };
      }

      if (error.response.status === 403) {
        return {
          success: false,
          error: 'GitHub API rate limit exceeded. Try again in an hour or add GITHUB_TOKEN to .env',
        };
      }
    }

    return {
      success: false,
      error: `Failed to fetch GitHub data: ${errorMessage}`,
    };
  }
}

/**
 * Mock Data for Demo
 */
export function getMockGitHubData(): ScrapeResult {
  return {
    success: true,
    isMock: true,
    profile: {
      username: 'demo',
      name: 'Demo Developer',
      bio: 'Building cool shit with code',
      public_repos: 42,
      followers: 1337,
      following: 69,
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    commits: [
      {
        message: 'fix: remove console.log (finally)',
        date: '2026-01-06',
        repo: 'demo/awesome-project',
      },
      { message: 'feat: add dark mode because why not', date: '2026-01-05', repo: 'demo/cool-app' },
      {
        message: 'refactor: this code was embarrassing',
        date: '2026-01-04',
        repo: 'demo/legacy-mess',
      },
      {
        message: 'docs: update README with actual instructions',
        date: '2026-01-03',
        repo: 'demo/awesome-project',
      },
      {
        message: 'chore: bump dependencies (pray nothing breaks)',
        date: '2026-01-02',
        repo: 'demo/cool-app',
      },
    ],
    readmes: [
      '# Awesome Project\n\nThis is a revolutionary tool that does something amazing. Built with love and caffeine.',
      '# Cool App\n\nA minimalist approach to solving complex problems. No bloat, just results.',
    ],
  };
}
