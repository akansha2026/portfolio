export type Stats = {
  githubFollowers: number;
  githubRepos: number;
  githubStars: number; // summed across public repos
  connexaLive: boolean;
};

const GITHUB_USER = "akansha2026";

export async function getGithub(): Promise<{ followers: number; repos: number }> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (!res.ok) return { followers: 0, repos: 0 };
    const data = (await res.json()) as { followers?: number; public_repos?: number };
    return { followers: data.followers ?? 0, repos: data.public_repos ?? 0 };
  } catch {
    return { followers: 0, repos: 0 };
  }
}

export async function getGithubStars(user = GITHUB_USER): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`
    );
    if (!res.ok) return 0;
    const repos = (await res.json()) as { stargazers_count?: number }[];
    if (!Array.isArray(repos)) return 0;
    return repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
  } catch {
    return 0;
  }
}

export async function getConnexaStatus(): Promise<boolean> {
  try {
    const res = await fetch("https://connexa-app.vercel.app", {
      method: "HEAD",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAllStats(): Promise<Stats> {
  const [github, githubStars, connexaLive] = await Promise.all([
    getGithub(),
    getGithubStars(),
    getConnexaStatus(),
  ]);

  return {
    githubFollowers: github.followers,
    githubRepos: github.repos,
    githubStars,
    connexaLive,
  };
}
