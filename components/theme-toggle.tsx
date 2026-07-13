"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Toggle theme"
      aria-label="Toggle theme"
      style={{
        width: 36,
        height: 36,
        border: "1px solid var(--line)",
        borderRadius: 10,
        background: "var(--card)",
        color: "var(--ink)",
        cursor: "pointer",
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.2s",
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
