"use client";

export function CommandHint() {
  return (
    <button
      type="button"
      className="cmdk-hint"
      aria-label="Open command menu"
      title="Open command menu"
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
    >
      ⌘K
    </button>
  );
}
