import { LiveStat } from "@/components/live-stat";
import { profile, socials } from "@/lib/content";
import type { Stats } from "@/lib/stats";

type HeroProps = {
  stats: Stats;
};

function findSocial(label: string): string {
  return socials.find((s) => s.label === label)?.href ?? "#";
}

export function Hero({ stats }: HeroProps) {
  const [waveEmoji, ...kickerRest] = profile.kicker.split(" ");
  const kickerText = kickerRest.join(" ");

  const accentIndex = profile.headline.indexOf(profile.accentWord);
  const beforeAccent =
    accentIndex >= 0 ? profile.headline.slice(0, accentIndex) : profile.headline;
  const afterAccent =
    accentIndex >= 0
      ? profile.headline.slice(accentIndex + profile.accentWord.length)
      : "";

  return (
    <header className="hero">
      <div className="wrap">
        <div className="kicker">
          <span className="wave">{waveEmoji}</span> {kickerText}
        </div>
        <h1 className="serif">
          {beforeAccent}
          {accentIndex >= 0 && <em>{profile.accentWord}</em>}
          {afterAccent}
        </h1>
        <p className="lead">{profile.lead}</p>
        <div className="hero-cta">
          <a className="btn" href="#work">
            See what I&apos;ve built →
          </a>
          <a
            className="btn btn-ghost"
            href={findSocial("GitHub")}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="btn btn-ghost"
            href={findSocial("LinkedIn")}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <span className="available">
            <span className="dot" /> open to new roles
          </span>
        </div>
        <div className="chips">
          <LiveStat value={stats.githubRepos} label="public repos" />
          <LiveStat value={stats.githubStars} label="GitHub stars" />
          <LiveStat value="4" label="live projects" />
          <LiveStat value="IIT-KGP" label="math & computing '26" />
        </div>
      </div>
    </header>
  );
}
