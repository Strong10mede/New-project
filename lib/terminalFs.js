import { resumeData } from "@/lib/resumeData";

const formatBullets = (items) => items.map((item) => `  - ${item}`).join("\n");

const formatExperience = (item) =>
  [
    `${item.role} | ${item.company}`,
    item.period,
    formatBullets(item.highlights)
  ].join("\n");

export const fileSystem = {
  "~": {
    type: "dir",
    children: {
      "profile.txt": {
        type: "file",
        content: `${resumeData.name} | ${resumeData.title}\n\n${resumeData.summary}\n\nGitHub: ${resumeData.github}`
      },
      "skills": {
        type: "dir",
        children: {
          "core.txt": {
            type: "file",
            content: formatBullets(resumeData.skills)
          }
        }
      },
      "experience": {
        type: "dir",
        children: {
          "airoha.txt": {
            type: "file",
            content: formatExperience(resumeData.experience[0])
          },
          "airoha-intern.txt": {
            type: "file",
            content: formatExperience(resumeData.experience[1])
          }
        }
      },
      "projects": {
        type: "dir",
        children: {
          [resumeData.projects[0].file]: {
            type: "file",
            content: `${resumeData.projects[0].name}\n\n${resumeData.projects[0].summary}`
          },
          [resumeData.projects[1].file]: {
            type: "file",
            content: `${resumeData.projects[1].name}\n\n${resumeData.projects[1].summary}`
          }
        }
      },
      "links": {
        type: "dir",
        children: {
          "github.txt": {
            type: "file",
            content: `GitHub\n${resumeData.github}`
          }
        }
      },
      "education": {
        type: "dir",
        children: {
          "nit-hamirpur.txt": {
            type: "file",
            content: [
              `${resumeData.education.degree} at ${resumeData.education.institution}`,
              resumeData.education.period,
              `CGPA: ${resumeData.education.cgpa}`
            ].join("\n")
          }
        }
      }
    }
  }
};

export const rootDirectories = [
  "bin",
  "boot",
  "dev",
  "etc",
  "home",
  "lib",
  "media",
  "mnt",
  "opt",
  "proc",
  "root",
  "run",
  "sbin",
  "srv",
  "sys",
  "tmp",
  "usr",
  "var"
];

export const commands = [
  "help",
  "whoami",
  "ls",
  "cd",
  "cat",
  "hexdump",
  "mail",
  "wget",
  "elixir",
  "neofetch",
  "soc-map",
  "ping",
  "play",
  "render",
  "wall",
  "git",
  "flash-ota",
  "sudo",
  "github",
  "emulator",
  "clear"
];

export function normalizePath(currentDirectory, target = "") {
  if (!target || target === ".") return currentDirectory;
  if (target === "~") return "~";
  if (target === "/") return "/";

  if (target.startsWith("~/")) {
    const homeTarget = target.slice(2);
    return homeTarget ? normalizePath("~", homeTarget) : "~";
  }

  if (target.startsWith("/") || currentDirectory.startsWith("/")) {
    const base = target.startsWith("/")
      ? []
      : currentDirectory.split("/").filter(Boolean);

    for (const part of target.replace(/^\/+/, "").split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") {
        base.pop();
      } else {
        base.push(part);
      }
    }

    return base.length ? `/${base.join("/")}` : "/";
  }

  const base = target.startsWith("/")
    ? []
    : currentDirectory === "~"
      ? []
      : currentDirectory.split("/").slice(1);

  for (const part of target.replace(/^\/+/, "").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      base.pop();
    } else {
      base.push(part);
    }
  }

  return base.length ? `~/${base.join("/")}` : "~";
}

export function getNode(path) {
  if (path === "/") {
    return { type: "dir", children: {} };
  }

  if (path.startsWith("/")) {
    const [, firstSegment, ...rest] = path.split("/");

    if (!rootDirectories.includes(firstSegment) || rest.length) {
      return null;
    }

    return { type: "dir", children: {} };
  }

  const parts = path === "~" ? [] : path.replace(/^~\/?/, "").split("/");
  let node = fileSystem["~"];

  for (const part of parts) {
    if (!node?.children?.[part]) return null;
    node = node.children[part];
  }

  return node;
}

export function listDirectory(path) {
  if (path === "/") {
    return rootDirectories;
  }

  if (path.startsWith("/")) {
    return getNode(path) ? [] : null;
  }

  const node = getNode(path);
  if (!node || node.type !== "dir") return null;

  return Object.entries(node.children).map(([name, child]) =>
    child.type === "dir" ? `${name}/` : name
  );
}

export function readFile(currentDirectory, path) {
  const resolved = normalizePath(currentDirectory, path);
  const node = getNode(resolved);

  if (!node || node.type !== "file") return null;
  return node.content;
}

export function getCompletionCandidates(currentDirectory) {
  const currentEntries = listDirectory(currentDirectory) ?? [];
  const rootEntries = listDirectory("~") ?? [];
  return [...commands, ...currentEntries, ...rootEntries];
}

export function completePath(currentDirectory, partialPath) {
  const trimmedPath = partialPath ?? "";
  const separatorIndex = trimmedPath.lastIndexOf("/");
  const parentFragment =
    separatorIndex >= 0 ? trimmedPath.slice(0, separatorIndex + 1) : "";
  const basename = separatorIndex >= 0 ? trimmedPath.slice(separatorIndex + 1) : trimmedPath;
  const parentPath = normalizePath(currentDirectory, parentFragment || ".");
  const entries = listDirectory(parentPath) ?? [];
  const matches = entries.filter((entry) => entry.startsWith(basename));

  return {
    matches: matches.map((match) => `${parentFragment}${match}`),
    completion:
      matches.length === 1 ? `${parentFragment}${matches[0]}` : null
  };
}
