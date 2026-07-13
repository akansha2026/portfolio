import { describe, it, expect } from "vitest";
import { projects, profile, toolbox, achievements } from "./content";
describe("content", () => {
  it("has all flagship projects", () => {
    expect(projects.map(p => p.slug)).toEqual(
      expect.arrayContaining(["connexa","synqx","windows-calculator","nasa-space"]));
  });
  it("connexa is marked as a case study", () => {
    expect(projects.find(p => p.slug === "connexa")?.caseStudy).toBe(true);
  });
  it("toolbox includes a Languages group", () => {
    expect(toolbox.map(g => g.title)).toContain("Languages");
  });
  it("has achievements", () => {
    expect(achievements.length).toBeGreaterThan(0);
  });
  it("profile email is correct", () => {
    expect(profile.email).toBe("akanshaiitkgp2005@gmail.com");
  });
});
