import { cacheLife } from 'next/cache';

import { GITHUB_API_URL, GITHUB_USER } from './constants';
import type { GitHubRepoResponse, RepoStats } from './types';

export async function getRepoStats(): Promise<RepoStats | null> {
  'use cache';
  cacheLife('hours');

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': `${GITHUB_USER}-books`,
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as GitHubRepoResponse;

    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      watchers: data.subscribers_count ?? 0,
      pushedAt: data.pushed_at ?? null,
    };
  } catch {
    return null;
  }
}
