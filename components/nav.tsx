import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandHint } from "@/components/command-hint";
import { TerminalHint } from "@/components/terminal-hint";
import { profile } from "@/lib/content";

export function Nav() {
  return (
    <nav>
      <div className="wrap nav-in">
        <div className="brand">
          <Logo />
          {profile.name}
        </div>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#highlights">Highlights</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-right">
          <TerminalHint />
          <CommandHint />
          <ThemeToggle />
          <a
            className="btn"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
