export interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  pushedAt: string | null;
}

export interface GitHubRepoResponse {
  stargazers_count?: number;
  forks_count?: number;
  subscribers_count?: number;
  pushed_at?: string;
}
