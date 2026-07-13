"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile, projects, socials } from "@/lib/content";

type Action = {
  id: string;
  label: string;
  run: () => void;
  /** Keep the palette open after running (e.g. to show a transient state). */
  keepOpen?: boolean;
};

const OPEN_EVENT = "open-command-palette";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

function openInNewTab(href: string) {
  window.open(href, "_blank", "noopener,noreferrer");
}

function toggleTheme() {
  const next = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", next ? "dark" : "light");
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [copied, setCopied] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlight(0);
    setCopied(false);
  }, []);

  const copyEmail = useCallback(() => {
    void navigator.clipboard?.writeText(profile.email).then(() => setCopied(true));
  }, []);

  const actions = useMemo<Action[]>(() => {
    const nav: Action[] = [
      { id: "nav-work", label: "Go to Work", run: () => scrollToHash("#work") },
      {
        id: "nav-highlights",
        label: "Go to Highlights",
        run: () => scrollToHash("#highlights"),
      },
      { id: "nav-skills", label: "Go to Skills", run: () => scrollToHash("#skills") },
      {
        id: "nav-contact",
        label: "Go to Contact",
        run: () => scrollToHash("#contact"),
      },
    ];

    const projectActions: Action[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: `Open ${p.title}`,
      run: () => {
        if (p.caseStudy) {
          window.location.href = `/work/${p.slug}`;
        } else if (p.links[0]) {
          openInNewTab(p.links[0].href);
        }
      },
    }));

    const socialActions: Action[] = socials.map((s) => ({
      id: `social-${s.label.toLowerCase()}`,
      label: `Open ${s.label}`,
      run: () => openInNewTab(s.href),
    }));

    const utility: Action[] = [
      {
        id: "open-terminal",
        label: "Open terminal",
        run: () => window.dispatchEvent(new Event("open-terminal")),
      },
      { id: "copy-email", label: "Copy email", run: copyEmail, keepOpen: true },
      { id: "toggle-theme", label: "Toggle theme", run: toggleTheme, keepOpen: true },
      {
        id: "open-resume",
        label: "Open résumé",
        run: () => openInNewTab("/resume.pdf"),
      },
    ];

    return [...nav, ...projectActions, ...socialActions, ...utility];
  }, [copyEmail]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  // Highlight, clamped to the current result set (avoids a state-sync effect).
  const activeIndex = filtered.length === 0 ? 0 : Math.min(highlight, filtered.length - 1);

  const runAction = useCallback(
    (action: Action | undefined) => {
      if (!action) return;
      action.run();
      if (!action.keepOpen) close();
    },
    [close]
  );

  // Global open shortcuts: ⌘K / Ctrl+K anywhere, "/" when not typing.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      const isSlash = e.key === "/" && !typing;

      if (isCmdK || isSlash) {
        e.preventDefault();
        if (open) close();
        else setOpen(true);
      }
    };
    const onOpenEvent = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, [open, close]);

  // Manage focus: capture + focus input on open, restore on close.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [open]);

  // Reset the transient "Copied!" state after 2s.
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  // Keep the highlighted row visible while navigating.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length > 0) setHighlight((activeIndex + 1) % filtered.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length > 0)
        setHighlight((activeIndex - 1 + filtered.length) % filtered.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runAction(filtered[activeIndex]);
      return;
    }
    if (e.key === "Tab") {
      // Trap focus within the dialog.
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  const reduced = prefersReducedMotion();

  return (
    <div
      className="cmdk-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className={reduced ? "cmdk-panel cmdk-no-anim" : "cmdk-panel"}
        onKeyDown={onDialogKeyDown}
      >
        <input
          ref={inputRef}
          className="cmdk-input"
          type="text"
          placeholder="Type a command or search…"
          aria-label="Search commands"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
          }}
        />
        <div className="cmdk-list" ref={listRef} role="listbox" aria-label="Commands">
          {filtered.length === 0 ? (
            <div className="cmdk-empty">No results</div>
          ) : (
            filtered.map((action, i) => {
              const isHot = i === activeIndex;
              const label =
                action.id === "copy-email" && copied ? "Copied!" : action.label;
              return (
                <button
                  key={action.id}
                  type="button"
                  data-index={i}
                  role="option"
                  aria-selected={isHot}
                  className={isHot ? "cmdk-row cmdk-row--hot" : "cmdk-row"}
                  onMouseMove={() => setHighlight(i)}
                  onClick={() => runAction(action)}
                >
                  {label}
                </button>
              );
            })
          )}
        </div>
        <div className="cmdk-footer mono">↑↓ navigate · ↵ select · esc close</div>
      </div>
    </div>
  );
}
