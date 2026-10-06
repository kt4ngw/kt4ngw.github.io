import { execFileSync } from "node:child_process";

// The scheduled visitor-statistics commits are not site updates, so skip them.
// Needs full git history: in a shallow clone the newest commit looks like it
// touched every file.
export function getLastModified(): Date | undefined {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ":(exclude)public/visitor-stats.json"],
      { encoding: "utf8" }
    ).trim();

    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}

export function getLastUpdated(): string {
  const lastModified = getLastModified();
  if (!lastModified) return "Recently";

  return lastModified.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
