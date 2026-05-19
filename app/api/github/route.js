import { NextResponse } from "next/server";
import { resumeData } from "@/lib/resumeData";

function getGitHubUsername() {
  const configuredUsername =
    process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME;

  if (configuredUsername) {
    return configuredUsername;
  }

  return resumeData.github.split("/").filter(Boolean).at(-1);
}

export async function GET() {
  try {
    const username = getGitHubUsername();

    if (!username) {
      return NextResponse.json(
        { error: "GitHub username is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "mayur-terminal-portfolio"
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}.`);
    }

    const events = await response.json();
    const pushEvents = events
      .filter((event) => event.type === "PushEvent")
      .slice(0, 5)
      .map((event) => {
        const latestCommit = [...(event.payload?.commits ?? [])].at(-1);

        return {
          id: event.id,
          repo: event.repo?.name ?? "",
          hash: latestCommit?.sha?.slice(0, 7) ?? event.id.slice(0, 7),
          author:
            latestCommit?.author?.name ||
            event.actor?.display_login ||
            event.actor?.login ||
            username,
          date: event.created_at,
          message: latestCommit?.message ?? `Push to ${event.repo?.name ?? "repository"}`
        };
      });

    return NextResponse.json({ username, events: pushEvents });
  } catch (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to fetch GitHub activity." },
      { status: 500 }
    );
  }
}
