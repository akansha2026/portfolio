"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  profile,
  projects,
  achievements,
  toolbox,
  education,
  coursework,
  socials,
} from "@/lib/content";
import type { Stats } from "@/lib/stats";

const OPEN_EVENT = "open-terminal";

type Tone = "default" | "muted" | "accent" | "error" | "success";

/** A styled fragment of a rendered terminal line. */
type Seg = {
  text: string;
  tone?: Tone;
  href?: string;
  newTab?: boolean;
  bold?: boolean;
};

/** One rendered line in the scrollback buffer. */
type Line = { id: number; segs: Seg[] };

const SECTIONS = ["work", "highlights", "skills", "education", "contact"] as const;

type CommandDoc = { name: string; args?: string; desc: string };

const COMMAND_DOCS: CommandDoc[] = [
  { name: "help", desc: "show this list of commands" },
  { name: "about", desc: "who I am (alias: whoami)" },
  { name: "ls", args: "[projects|sections]", desc: "list projects or sections" },
  { name: "open", args: "<target>", desc: "open a project, section, social or resume" },
  { name: "cat", args: "<slug>", desc: "show details for a project" },
  { name: "highlights", desc: "my achievements & highlights (alias: achievements)" },
  { name: "skills", desc: "list the toolbox by category" },
  { name: "education", desc: "degree + relevant coursework" },
  { name: "stats", desc: "fetch live GitHub + project stats" },
  { name: "email", desc: "print my email and copy it to the clipboard" },
  { name: "social", desc: "list my social links (alias: links)" },
  { name: "github", desc: "open GitHub in a new tab" },
  { name: "linkedin", desc: "open LinkedIn in a new tab" },
  { name: "theme", args: "[dark|light|toggle]", desc: "switch the color theme" },
  { name: "resume", desc: "open my résumé (PDF) in a new tab" },
  { name: "clear", desc: "clear the screen" },
  { name: "exit", desc: "close the terminal (alias: close, quit)" },
];

/** Every accepted command word, used for tab-completion. */
const COMMAND_WORDS = [
  "help",
  "about",
  "whoami",
  "ls",
  "open",
  "cat",
  "highlights",
  "achievements",
  "skills",
  "education",
  "stats",
  "email",
  "social",
  "links",
  "github",
  "linkedin",
  "theme",
  "resume",
  "clear",
  "exit",
  "close",
  "quit",
];

/** Alias → canonical command name, so help/usage resolves correctly. */
const ALIAS_TO_PRIMARY: Record<string, string> = {
  whoami: "about",
  achievements: "highlights",
  links: "social",
  close: "exit",
  quit: "exit",
};

function canonical(cmd: string): string {
  return ALIAS_TO_PRIMARY[cmd] ?? cmd;
}

function docFor(cmd: string): CommandDoc | undefined {
  return COMMAND_DOCS.find((d) => d.name === canonical(cmd));
}

/** One-line usage for a command, e.g. "usage: theme [dark|light|toggle]". */
function usageSegs(cmd: string): Seg[][] {
  const doc = docFor(cmd);
  if (!doc) return [[{ text: `no help for: ${cmd}`, tone: "error" }], []];
  const invocation = doc.args ? `${doc.name} ${doc.args}` : doc.name;
  return [
    [
      { text: "usage: ", tone: "muted" },
      { text: invocation, tone: "accent" },
    ],
    [{ text: `  ${doc.desc}`, tone: "muted" }],
    [],
  ];
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function openInNewTab(href: string) {
  window.open(href, "_blank", "noopener,noreferrer");
}

function applyTheme(mode: "dark" | "light") {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem("theme", mode);
}

function longestCommonPrefix(words: string[]): string {
  if (words.length === 0) return "";
  let prefix = words[0];
  for (const w of words.slice(1)) {
    while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (!prefix) break;
  }
  return prefix;
}

/**
 * Scrollback lines. Memoized so typing (which only changes `input`) never
 * re-renders the whole history — the buffer reference only changes when a
 * command runs, keeping keystrokes smooth even with a long session.
 */
const TerminalLines = memo(function TerminalLines({ buffer }: { buffer: Line[] }) {
  return (
    <>
      {buffer.map((line) => (
        <div className="term-line" key={line.id}>
          {line.segs.length === 0
            ? " "
            : line.segs.map((seg, i) =>
                seg.href ? (
                  <a
                    key={i}
                    href={seg.href}
                    target={seg.newTab ? "_blank" : undefined}
                    rel={seg.newTab ? "noopener noreferrer" : undefined}
                    className="term-seg term-accent term-link"
                  >
                    {seg.text}
                  </a>
                ) : (
                  <span
                    key={i}
                    className={`term-seg${seg.tone ? ` term-${seg.tone}` : ""}${
                      seg.bold ? " term-bold" : ""
                    }`}
                  >
                    {seg.text}
                  </span>
                )
              )}
        </div>
      ))}
    </>
  );
});

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [buffer, setBuffer] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [size, setSize] = useState<"normal" | "max" | "min">("normal");

  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const nextId = useRef(0);
  const history = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  /** Append one or more lines (each an array of segments) to the buffer. */
  const emit = useCallback((linesOfSegs: Seg[][]) => {
    setBuffer((prev) => [
      ...prev,
      ...linesOfSegs.map((segs) => ({ id: nextId.current++, segs })),
    ]);
  }, []);

  const banner = useCallback((): Seg[][] => {
    const ak = [
      "    _    _  __",
      "   / \\  | |/ /",
      "  / _ \\ | ' / ",
      " / ___ \\| . \\ ",
      "/_/   \\_\\_|\\_\\",
    ];
    const lines: Seg[][] = ak.map((l) => [{ text: l, tone: "accent" }]);
    lines.push([]);
    lines.push([{ text: profile.name, bold: true }]);
    lines.push([{ text: profile.role, tone: "muted" }]);
    lines.push([]);
    lines.push([
      { text: "type " },
      { text: "help", tone: "accent" },
      { text: " to get started · try " },
      { text: "ls", tone: "accent" },
      { text: ", " },
      { text: "stats", tone: "accent" },
      { text: " or " },
      { text: "theme", tone: "accent" },
      { text: "." },
    ]);
    lines.push([]);
    return lines;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setInput("");
    setSize("normal");
    historyIndex.current = -1;
  }, []);

  /** Ghost-text suggestion: the remaining chars that would complete `input`. */
  const suggestion = (() => {
    if (!input) return "";
    const parts = input.split(/\s+/);
    if (parts.length <= 1) {
      const frag = parts[0].toLowerCase();
      const m = COMMAND_WORDS.find((w) => w.startsWith(frag) && w !== frag);
      return m ? m.slice(frag.length) : "";
    }
    const cmd = parts[0].toLowerCase();
    const frag = (parts[1] ?? "").toLowerCase();
    let pool: string[] = [];
    if (cmd === "cat") pool = projects.map((p) => p.slug);
    else if (cmd === "open")
      pool = [
        ...projects.map((p) => p.slug),
        ...SECTIONS,
        "github",
        "linkedin",
        "resume",
      ];
    else if (cmd === "theme") pool = ["dark", "light", "toggle"];
    else return "";
    const m = pool.find((w) => w.startsWith(frag) && w !== frag);
    return m ? m.slice(frag.length) : "";
  })();

  const runCommand = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      // Echo the prompt + command.
      emit([
        [
          { text: "akansha@portfolio", tone: "accent" },
          { text: ":~$ ", tone: "muted" },
          { text: raw },
        ],
      ]);

      history.current.push(trimmed);
      historyIndex.current = -1;

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);
      const arg = (args[0] ?? "").toLowerCase();

      const notFound = () =>
        emit([
          [
            { text: `command not found: ${cmd}. `, tone: "error" },
            { text: "type " },
            { text: "help", tone: "accent" },
            { text: "." },
          ],
        ]);

      // A --help / -h flag must NEVER trigger a side effect (e.g. `theme --help`
      // used to toggle the theme). Intercept it for any known command.
      if (args.includes("--help") || args.includes("-h")) {
        if (docFor(cmd)) {
          emit(usageSegs(cmd));
          return;
        }
      }

      switch (cmd) {
        case "help": {
          // `help <command>` → detailed usage for that command.
          if (arg) {
            if (docFor(arg)) emit(usageSegs(arg));
            else
              emit([
                [
                  { text: `help: no such command: ${arg}`, tone: "error" },
                ],
                [],
              ]);
            break;
          }
          emit([[{ text: "Available commands", tone: "muted" }], []]);
          emit(
            COMMAND_DOCS.map((c) => {
              const invocation = c.args ? `${c.name} ${c.args}` : c.name;
              return [
                { text: `  ${invocation.padEnd(22)}`, tone: "accent" },
                { text: c.desc, tone: "muted" },
              ];
            })
          );
          emit([
            [],
            [
              { text: "tip: ", tone: "muted" },
              { text: "help <command>", tone: "accent" },
              { text: " or ", tone: "muted" },
              { text: "<command> --help", tone: "accent" },
              { text: " for details.", tone: "muted" },
            ],
            [],
          ]);
          break;
        }

        case "about":
        case "whoami": {
          emit([[{ text: profile.role, bold: true }], [], [{ text: profile.lead, tone: "muted" }], []]);
          break;
        }

        case "ls": {
          if (arg === "sections") {
            emit([[{ text: "sections", tone: "muted" }], []]);
            emit(SECTIONS.map((s) => [{ text: `  ${s}`, tone: "accent" }]));
            emit([[]]);
          } else {
            emit([[{ text: "projects", tone: "muted" }], []]);
            emit(
              projects.map((p) => [
                { text: `  ${p.slug.padEnd(20)}`, tone: "accent" },
                { text: p.title, tone: "muted" },
              ])
            );
            emit([[]]);
          }
          break;
        }

        case "open": {
          if (!arg) {
            emit([[{ text: "usage: open <target>", tone: "error" }], []]);
            break;
          }
          const project = projects.find((p) => p.slug === arg);
          if (project) {
            if (project.caseStudy) {
              window.location.href = `/work/${project.slug}`;
            } else if (project.links[0]) {
              openInNewTab(project.links[0].href);
              emit([[{ text: `opening ${project.links[0].href}`, tone: "success" }], []]);
            }
            break;
          }
          const social = socials.find((s) => s.label.toLowerCase() === arg);
          if (social) {
            openInNewTab(social.href);
            emit([[{ text: `opening ${social.href}`, tone: "success" }], []]);
            break;
          }
          if (arg === "resume") {
            openInNewTab("/resume.pdf");
            emit([[{ text: "opening /resume.pdf", tone: "success" }], []]);
            break;
          }
          if ((SECTIONS as readonly string[]).includes(arg)) {
            close();
            requestAnimationFrame(() => {
              const el = document.getElementById(arg);
              el?.scrollIntoView({
                behavior: prefersReducedMotion() ? "auto" : "smooth",
                block: "start",
              });
            });
            break;
          }
          emit([[{ text: `open: unknown target: ${arg}`, tone: "error" }], []]);
          break;
        }

        case "cat": {
          if (!arg) {
            emit([[{ text: "usage: cat <slug>", tone: "error" }], []]);
            break;
          }
          const project = projects.find((p) => p.slug === arg);
          if (!project) {
            emit([[{ text: `cat: no such project: ${arg}`, tone: "error" }], []]);
            break;
          }
          emit([
            [{ text: project.title, bold: true }],
            [],
            [{ text: project.blurb, tone: "muted" }],
            [],
            [
              { text: "tags: ", tone: "muted" },
              { text: project.tags.join(", ") },
            ],
          ]);
          emit([
            [
              { text: "links: ", tone: "muted" },
              ...project.links.flatMap((l, i): Seg[] => [
                ...(i > 0 ? [{ text: "  " }] : []),
                { text: `${l.label} ↗`, tone: "accent", href: l.href, newTab: true },
              ]),
            ],
            [],
          ]);
          break;
        }

        case "highlights":
        case "achievements": {
          achievements.forEach((a) => {
            emit([
              [
                { text: "★ ", tone: "accent" },
                { text: a.title, bold: true },
              ],
              [{ text: a.detail, tone: "muted" }],
              [],
            ]);
          });
          break;
        }

        case "skills": {
          toolbox.forEach((group) => {
            emit([
              [
                { text: `${group.title}: `, tone: "accent" },
                { text: group.items.join(", ") },
              ],
            ]);
          });
          emit([[]]);
          break;
        }

        case "education": {
          emit([
            [{ text: education.degree, bold: true }],
            [
              { text: education.school, tone: "accent" },
              { text: "  " },
              { text: education.when, tone: "muted" },
            ],
            [],
            [{ text: "relevant coursework", tone: "muted" }],
          ]);
          emit(coursework.map((l) => [{ text: "  ▹ ", tone: "accent" }, { text: l }]));
          emit([[]]);
          break;
        }

        case "stats": {
          emit([[{ text: "fetching live stats…", tone: "muted" }]]);
          try {
            const res = await fetch("/api/stats");
            if (!res.ok) throw new Error(String(res.status));
            const s = (await res.json()) as Stats;
            emit([
              [
                { text: "  GitHub".padEnd(16), tone: "muted" },
                { text: `${s.githubRepos.toLocaleString()} public repos` },
              ],
              [
                { text: "  Stars".padEnd(16), tone: "muted" },
                { text: `${s.githubStars.toLocaleString()} across public repos` },
              ],
              [
                { text: "  Connexa".padEnd(16), tone: "muted" },
                {
                  text: s.connexaLive ? "● live" : "● offline",
                  tone: s.connexaLive ? "success" : "muted",
                },
              ],
              [],
            ]);
          } catch {
            emit([[{ text: "stats: failed to fetch live data.", tone: "error" }], []]);
          }
          break;
        }

        case "email": {
          emit([[{ text: profile.email, tone: "accent" }]]);
          try {
            await navigator.clipboard?.writeText(profile.email);
            emit([[{ text: "copied to clipboard ✓", tone: "success" }], []]);
          } catch {
            emit([[{ text: "(couldn't access the clipboard)", tone: "muted" }], []]);
          }
          break;
        }

        case "social":
        case "links": {
          emit(
            socials.map((s) => [
              { text: `  ${s.label.padEnd(10)}`, tone: "muted" },
              { text: `${s.href} ↗`, tone: "accent", href: s.href, newTab: true },
            ])
          );
          emit([[]]);
          break;
        }

        case "github":
        case "linkedin": {
          const social = socials.find((s) => s.label.toLowerCase() === cmd);
          if (social) {
            openInNewTab(social.href);
            emit([[{ text: `opening ${social.href}`, tone: "success" }], []]);
          } else {
            notFound();
          }
          break;
        }

        case "theme": {
          let mode: "dark" | "light";
          if (arg === "dark" || arg === "light") {
            mode = arg;
          } else if (arg === "" || arg === "toggle") {
            mode = document.documentElement.classList.contains("dark")
              ? "light"
              : "dark";
          } else {
            // unknown argument — show usage instead of silently toggling
            emit([
              [{ text: `theme: unknown option: ${arg}`, tone: "error" }],
              ...usageSegs("theme"),
            ]);
            break;
          }
          applyTheme(mode);
          emit([[{ text: `theme set to ${mode}`, tone: "success" }], []]);
          break;
        }

        case "resume": {
          openInNewTab("/resume.pdf");
          emit([[{ text: "opening /resume.pdf", tone: "success" }], []]);
          break;
        }

        case "clear": {
          setBuffer([]);
          break;
        }

        case "exit":
        case "close":
        case "quit": {
          close();
          break;
        }

        case "sudo": {
          emit([
            [{ text: "nice try 😏 — you don't have root here.", tone: "muted" }],
            [],
          ]);
          break;
        }

        default:
          notFound();
      }
    },
    [emit, close]
  );

  const handleSubmit = useCallback(() => {
    const value = input;
    setInput("");
    void runCommand(value);
  }, [input, runCommand]);

  const completeTab = useCallback(() => {
    const value = input;
    const hasSpace = /\s/.test(value.trimStart());
    if (!value.trim()) return;

    if (!hasSpace) {
      const frag = value.trim().toLowerCase();
      const matches = COMMAND_WORDS.filter((w) => w.startsWith(frag));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        const lcp = longestCommonPrefix(matches);
        if (lcp.length > frag.length) setInput(lcp);
        else emit([[{ text: matches.join("   "), tone: "muted" }]]);
      }
      return;
    }

    // Second-token completion for open / cat.
    const [head, ...rest] = value.split(/\s+/);
    const cmd = head.toLowerCase();
    const frag = (rest[0] ?? "").toLowerCase();
    let pool: string[] = [];
    if (cmd === "cat") {
      pool = projects.map((p) => p.slug);
    } else if (cmd === "open") {
      pool = [
        ...projects.map((p) => p.slug),
        ...SECTIONS,
        "github",
        "linkedin",
        "resume",
      ];
    } else if (cmd === "theme") {
      pool = ["dark", "light", "toggle"];
    } else {
      return;
    }
    const matches = pool.filter((w) => w.startsWith(frag));
    if (matches.length === 1) {
      setInput(`${head} ${matches[0]}`);
    } else if (matches.length > 1) {
      const lcp = longestCommonPrefix(matches);
      if (lcp.length > frag.length) setInput(`${head} ${lcp}`);
      else emit([[{ text: matches.join("   "), tone: "muted" }]]);
    }
  }, [input, emit]);

  // Global open triggers: custom event + backtick key.
  useEffect(() => {
    const onOpenEvent = () => setOpen(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "`") return;
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (typing) return;
      e.preventDefault();
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // On open: render banner (once per open), capture + move focus. Restore on close.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setBuffer(banner().map((segs) => ({ id: nextId.current++, segs })));
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [open, banner]);

  // Auto-scroll to the bottom whenever the buffer grows.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [buffer]);

  const onDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) setInput(input + suggestion);
      else completeTab();
      return;
    }
    if (e.key === "ArrowRight" && suggestion) {
      const el = e.currentTarget;
      if (el.selectionStart === input.length && el.selectionEnd === input.length) {
        e.preventDefault();
        setInput(input + suggestion);
        return;
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = history.current;
      if (h.length === 0) return;
      if (historyIndex.current === -1) historyIndex.current = h.length - 1;
      else historyIndex.current = Math.max(0, historyIndex.current - 1);
      setInput(h[historyIndex.current]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (h.length === 0 || historyIndex.current === -1) return;
      if (historyIndex.current >= h.length - 1) {
        historyIndex.current = -1;
        setInput("");
      } else {
        historyIndex.current += 1;
        setInput(h[historyIndex.current]);
      }
    }
  };

  if (!open) return null;

  const reduced = prefersReducedMotion();

  return (
    <div
      className="term-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className={`term-window${size === "max" ? " term-window--max" : ""}${
          size === "min" ? " term-window--min" : ""
        }${reduced ? " term-no-anim" : ""}`}
        onKeyDown={onDialogKeyDown}
      >
        <div
          className="term-bar"
          onDoubleClick={() => setSize((s) => (s === "max" ? "normal" : "max"))}
          onClick={() => {
            if (size === "min") {
              setSize("normal");
              requestAnimationFrame(() => inputRef.current?.focus());
            }
          }}
        >
          <span className="term-dots">
            <button
              type="button"
              className="term-dot term-dot--1"
              title="Close"
              aria-label="Close terminal"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              ×
            </button>
            <button
              type="button"
              className="term-dot term-dot--2"
              title="Minimize"
              aria-label="Minimize terminal"
              onClick={(e) => {
                e.stopPropagation();
                setSize((s) => (s === "min" ? "normal" : "min"));
              }}
            >
              −
            </button>
            <button
              type="button"
              className="term-dot term-dot--3"
              title="Maximize"
              aria-label="Maximize terminal"
              onClick={(e) => {
                e.stopPropagation();
                setSize((s) => (s === "max" ? "normal" : "max"));
              }}
            >
              +
            </button>
          </span>
          <span className="term-title">akansha@portfolio — zsh</span>
          <button
            type="button"
            className="term-x"
            aria-label="Close terminal"
            onClick={close}
          >
            ×
          </button>
        </div>

        <div
          ref={bodyRef}
          className="term-body"
          onClick={() => inputRef.current?.focus()}
        >
          <TerminalLines buffer={buffer} />

          <div className="term-line term-inputline">
            <span className="term-seg term-accent">akansha@portfolio</span>
            <span className="term-seg term-muted">:~$&nbsp;</span>
            <span className="term-inputwrap">
              <span className="term-typed">{input}</span>
              <span
                className={reduced ? "term-cursor term-cursor--static" : "term-cursor"}
                aria-hidden="true"
              />
              {suggestion && (
                <span className="term-ghost" aria-hidden="true">
                  {suggestion}
                </span>
              )}
              <input
                ref={inputRef}
                className="term-input-real"
                type="text"
                aria-label="Terminal input"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
