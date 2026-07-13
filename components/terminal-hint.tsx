"use client";

export function TerminalHint() {
  return (
    <button
      type="button"
      className="term-hint"
      aria-label="Open terminal"
      title="Open terminal ( ` )"
      onClick={() => window.dispatchEvent(new Event("open-terminal"))}
    >
      {">_"}
    </button>
  );
}
