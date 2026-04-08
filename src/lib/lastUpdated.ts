import { execSync } from "node:child_process";

export function getLastUpdated(): string {
  try {
    const iso = execSync('git log -1 --format=%cI', {
      encoding: "utf8",
    }).trim();

    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}