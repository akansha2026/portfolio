import { describe, it, expect, vi } from "vitest";
import { getGithubStars, getConnexaStatus } from "./stats";
describe("stats", () => {
  it("sums stargazers across repos", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ stargazers_count: 3 }, { stargazers_count: 5 }],
    }) as any;
    expect(await getGithubStars("akansha2026")).toBe(8);
  });
  it("returns 0 stars on error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("down")) as any;
    expect(await getGithubStars("akansha2026")).toBe(0);
  });
  it("connexa status true on 200", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true }) as any;
    expect(await getConnexaStatus()).toBe(true);
  });
  it("connexa status false on throw", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("x")) as any;
    expect(await getConnexaStatus()).toBe(false);
  });
});
