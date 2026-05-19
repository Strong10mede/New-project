"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  commands,
  completePath,
  getCompletionCandidates,
  getNode,
  listDirectory,
  normalizePath,
  readFile
} from "@/lib/terminalFs";
import { resumeData } from "@/lib/resumeData";
import { useTheme } from "@/components/ThemeProvider";
import Typewriter from "@/components/Typewriter";
import TuxGame from "@/components/TuxGame";
import useGuestbookSubscription from "@/hooks/useGuestbookSubscription";

const bootLines = [
  "Mayur GNU/Linux terminal Mayur tty1",
  "Type `help` to list available commands.",
  ""
];

const helpSections = [
  {
    title: "SYSTEM & INFO",
    commands: [
      ["whoami", "Print professional summary and background."],
      ["neofetch", "Display system specs, OS, and kernel stats."],
      ["soc-map", "[Interactive] Open the ARM SoC Block Diagram."],
      ["clear", "Clear the terminal screen."]
    ]
  },
  {
    title: "FILE SYSTEM",
    commands: [
      ["ls", "List directory contents (skills/, projects/, etc.)."],
      ["cat <file>", "Concatenate and print file contents (e.g., cat profile.dts)."],
      ["hexdump", "View memory dump of project data."]
    ]
  },
  {
    title: "NETWORK & KERNEL",
    commands: [
      ["ping <tgt>", "Ping and route to external links (github, linkedin)."],
      ["wall <message>", "Post to the shared realtime guestbook."],
      ["git log", "Stream my latest public GitHub push activity."],
      ["elixir <q>", "Search the Linux kernel source via Bootlin."],
      ["wget resume", "Download my official PDF resume."]
    ]
  },
  {
    title: "PROGRAMS",
    commands: [
      ["emulator", "Launch the OS Web Emulator (OpenWrt, Linux, prplOS)."],
      ["play tux", "Launch the hidden 2D Super Tux survival game."],
      ["render 3d", "Switch to PCB mode and render the interactive SoC chip."],
      ["flash-ota", "Simulate an over-the-air firmware update and reboot."]
    ]
  }
];

const pingTargets = {
  github: {
    host: "github.com",
    label: "GitHub",
    getUrl: () => resumeData.github
  },
  linkedin: {
    host: "linkedin.com",
    label: "LinkedIn",
    getUrl: () => resumeData.linkedin
  },
  email: {
    host: "mail.mayur.local",
    label: "Email",
    getUrl: () => (resumeData.email ? `mailto:${resumeData.email}` : "")
  }
};

function Prompt({ directory }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-[color:var(--theme-prompt-user)]">{resumeData.promptUser}</span>
      <span className="text-[color:var(--theme-muted)]">@</span>
      <span className="text-[color:var(--theme-prompt-host)]">{resumeData.promptHost}</span>
      <span className="text-[color:var(--theme-muted)]">:</span>
      <span className="text-[color:var(--theme-prompt-host)]">{directory}</span>
      <span className="text-[color:var(--theme-muted)]">$ </span>
    </span>
  );
}

function tokenize(input) {
  return input.match(/"([^"]*)"|'([^']*)'|\S+/g)?.map((part) =>
    part.replace(/^["']|["']$/g, "")
  ) ?? [];
}

async function logCommand(command) {
  try {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command })
    });
  } catch {
    // Fire-and-forget telemetry should never interrupt the terminal.
  }
}

function downloadResume() {
  const link = document.createElement("a");
  link.href = "/Mayur_Resume.pdf";
  link.download = "Mayur_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function formatGitDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
  const offsetRemainder = String(absoluteOffset % 60).padStart(2, "0");

  return `${days[date.getDay()]} ${months[date.getMonth()]} ${String(date.getDate()).padStart(2, " ")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} ${date.getFullYear()} ${sign}${offsetHours}${offsetRemainder}`;
}

function GitLogOutput({ entries }) {
  return (
    <div className="space-y-4 whitespace-pre-wrap break-words text-[color:var(--theme-text)]">
      {entries.map((entry) => (
        <pre className="whitespace-pre-wrap break-words" key={entry.id}>
          <span className="text-[color:var(--theme-text)]">commit </span>
          <span className="text-yellow-400">{entry.hash}</span>
          {"\n"}
          <span>Author: {entry.author}</span>
          {"\n"}
          <span>Date:   {formatGitDate(entry.date)}</span>
          {"\n\n"}
          <span>    {entry.message}</span>
        </pre>
      ))}
    </div>
  );
}

function createNeofetchOutput() {
  const logo = [
    "      .----------------.",
    "     /  MK   CPU-0    /|",
    "    /----------------/ |",
    "    |  []  []  []   |  |",
    "    |  ARM AArch64  |  |",
    "    |  TZ  SMC GPT  | /",
    "    '----------------'"
  ];

  const stats = [
    "User:   mayur@airoha",
    `Role:   ${resumeData.title}`,
    "OS:     Linux / OpenWrt / prplOS",
    "Kernel: v6.6+ (Mainline Contributor)",
    "Arch:   ARM AArch64 & TrustZone",
    "Uptime: 2+ Years"
  ];

  return logo
    .map((line, index) => `${line.padEnd(28, " ")} ${stats[index] ?? ""}`)
    .join("\n");
}

function createHexdumpOutput() {
  const source = [
    "watchdog driver merged mainline",
    "trustzone smc gpt storage",
    "openwrt linux kernel arm64"
  ].join(" ");
  const bytes = Array.from(source).map((character) => character.charCodeAt(0));
  const rows = [];

  for (let offset = 0; offset < bytes.length; offset += 16) {
    const chunk = bytes.slice(offset, offset + 16);
    const hex = chunk
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(" ")
      .padEnd(47, " ");
    const ascii = chunk
      .map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : "."))
      .join("");

    rows.push(`${offset.toString(16).padStart(8, "0")}  ${hex}  |${ascii}|`);
  }

  return rows.join("\n");
}

function HelpOutput() {
  return (
    <div className="max-w-4xl py-1 font-terminal text-[color:var(--theme-text)]">
      {helpSections.map((section) => (
        <div className="mb-5" key={section.title}>
          <div className="mb-1 text-[color:var(--theme-muted)]">[ {section.title} ]</div>
          <div className="grid grid-cols-[minmax(8.5rem,12rem)_1fr] gap-x-4 gap-y-1">
            {section.commands.map(([command, description]) => (
              <div className="contents" key={command}>
                <span className="whitespace-pre text-[color:var(--theme-accent)]">
                  {command}
                </span>
                <span className="min-w-0 break-words text-[color:var(--theme-text)]">
                  - {description}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Terminal({ onOpenEmulator, onOpenSocMap, onOpenHardware }) {
  const { theme } = useTheme();
  const lineIdRef = useRef(0);
  const createLine = useCallback((line) => ({ id: lineIdRef.current++, ...line }), []);
  const [lines, setLines] = useState(() =>
    bootLines.map((content, index) =>
      createLine({
        type: "output",
        content: index === 0 ? `${theme.label} mode :: ${content}` : content
      })
    )
  );
  const [input, setInput] = useState("");
  const [directory, setDirectory] = useState("~");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [panicMode, setPanicMode] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const didAutoRunRef = useRef(false);

  const prompt = useMemo(() => <Prompt directory={directory} />, [directory]);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [lines, input]);

  useEffect(() => {
    if (!gameActive) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [gameActive]);

  useEffect(() => {
    if (didAutoRunRef.current) return;
    didAutoRunRef.current = true;

    const timer = window.setTimeout(() => {
      setLines((current) => [
        ...current,
        createLine({ type: "command", content: "neofetch", directory: "~" }),
        createLine({ type: "output", content: createNeofetchOutput(), animated: true })
      ]);
      logCommand("neofetch");
    }, 450);

    return () => window.clearTimeout(timer);
  }, [createLine]);

  const appendLine = useCallback(
    (content, options = {}) => {
      const line = createLine({
        type: options.type ?? "output",
        content,
        animated: options.animated ?? true,
        directory: options.directory,
        entries: options.entries
      });

      setLines((current) => [...current, line]);
      return line.id;
    },
    [createLine]
  );

  const replaceLine = useCallback((lineId, updates) => {
    setLines((current) =>
      current.map((line) => (line.id === lineId ? { ...line, ...updates } : line))
    );
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  const print = useCallback(
    (content, options = {}) => appendLine(content, options),
    [appendLine]
  );

  const exitGame = useCallback(() => {
    setGameActive(false);
    setLines((current) => [
      ...current,
      createLine({ type: "output", content: "[OK] Returned to terminal." })
    ]);
  }, [createLine]);

  useGuestbookSubscription(
    useCallback(
      (message, entry) => {
        print(`Broadcast message from ${entry?.author ?? "guest@visitor"}: ${message}`, {
          animated: false
        });
      },
      [print]
    )
  );

  const runFlashOta = useCallback(async () => {
    setIsBusy(true);
    clearTerminal();

    try {
      print("[INFO] Initiating Over-The-Air (OTA) update...", { animated: false });
      await delay(450);
      print("[INFO] Verifying signature of MayurOS.bin... [VALID]", { animated: false });
      await delay(500);
      print("[INFO] Erasing flash sector 0x08000000... [OK]", { animated: false });
      await delay(400);

      const progressLineId = appendLine("[INFO] Writing payload: [                    ] 0%", {
        animated: false
      });

      for (let step = 0; step <= 20; step += 1) {
        const filled = "|".repeat(step);
        const empty = " ".repeat(20 - step);
        const percent = step * 5;
        replaceLine(
          progressLineId,
          {
            content: `[INFO] Writing payload: [${filled}${empty}] ${percent}%`
          }
        );
        await delay(step === 20 ? 200 : 120);
      }

      print("[INFO] Rebooting system...", { animated: false });
      await delay(700);
      window.location.reload();
    } catch (error) {
      print(`[ERR] ${error.message ?? "OTA update failed."}`, { animated: false });
      setIsBusy(false);
    }
  }, [appendLine, clearTerminal, print, replaceLine]);

  const execute = async (enteredCommand) => {
    const commandLine = enteredCommand.trim();

    setLines((current) => [
      ...current,
      createLine({ type: "command", content: enteredCommand, directory })
    ]);

    if (!commandLine) return;

    setHistory((current) => [commandLine, ...current.filter((item) => item !== commandLine)]);
    setHistoryIndex(null);
    logCommand(commandLine);

    const [commandToken = "", ...args] = tokenize(commandLine);
    const command = commandToken.toLowerCase();
    const normalizedCommandLine = commandLine.replace(/\s+/g, " ");

    if (command === "clear") {
      clearTerminal();
      setPanicMode(false);
      return;
    }

    if (normalizedCommandLine === "sudo rm -rf /") {
      setPanicMode(true);
      print("[ERROR] Unauthorized user. Incident reported.");
      window.setTimeout(() => setPanicMode(false), 1400);
      return;
    }

    if (command === "help") {
      print(null, { type: "help", animated: false });
      return;
    }

    if (command === "neofetch") {
      print(createNeofetchOutput());
      return;
    }

    if (command === "whoami") {
      print(`${resumeData.name} | ${resumeData.title}\n\n${resumeData.summary}`);
      return;
    }

    if (command === "ls") {
      const targetPath = normalizePath(directory, args[0]);
      const entries = listDirectory(targetPath);
      print(entries ? entries.join("  ") : `ls: cannot access '${args[0]}': No such directory`);
      return;
    }

    if (command === "cd") {
      const targetPath = normalizePath(directory, args[0] ?? "~");
      const node = getNode(targetPath);

      if (!node || node.type !== "dir") {
        print(`cd: no such directory: ${args[0] ?? ""}`);
        return;
      }

      setDirectory(targetPath);
      return;
    }

    if (command === "cat") {
      if (!args[0]) {
        print("cat: missing file operand");
        return;
      }

      const content = readFile(directory, args[0]);
      print(content ?? `cat: ${args[0]}: No such file`);
      return;
    }

    if (command === "hexdump") {
      print(createHexdumpOutput());
      return;
    }

    if (command === "mail") {
      const message = args.join(" ").trim();

      if (!message) {
        print('usage: mail "Hi Mayur, let\'s connect"');
        return;
      }

      print("[...] Establishing secure route to Mayur's inbox");

      try {
        const response = await fetch("/api/mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || "Message route failed");
        }

        print("[OK] Message routed to Mayur's secure inbox.");
      } catch (error) {
        print(`[ERR] ${error.message}`);
      }
      return;
    }

    if (command === "wall") {
      const message = args.join(" ").trim();

      if (!message) {
        print("wall: usage: wall <message>");
        return;
      }

      try {
        const response = await fetch("/api/wall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || "Unable to broadcast wall message.");
        }

        print("[OK] Message posted to guestbook.", { animated: false });
      } catch (error) {
        print(`[ERR] ${error.message}`);
      }
      return;
    }

    if (command === "git") {
      if (args[0]?.toLowerCase() !== "log") {
        print("git: usage: git log");
        return;
      }

      try {
        const response = await fetch("/api/github", { cache: "no-store" });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || "Unable to load git history.");
        }

        const result = await response.json();

        if (!result.events?.length) {
          print("fatal: no recent PushEvent activity found.", { animated: false });
          return;
        }

        print(null, {
          type: "git-log",
          animated: false,
          entries: result.events
        });
      } catch (error) {
        print(`[ERR] ${error.message}`);
      }
      return;
    }

    if (command === "wget") {
      const target = args[0]?.toLowerCase();

      if (target !== "resume.pdf" && target !== "resume") {
        print("wget: usage: wget resume");
        return;
      }

      downloadResume();
      print("[OK] File saved to local machine.");
      return;
    }

    if (command === "soc-map") {
      onOpenSocMap?.();
      print("[OK] Rendering SoC block diagram.");
      return;
    }

    if (command === "render") {
      if (args[0]?.toLowerCase() !== "3d") {
        print("render: usage: render 3d");
        return;
      }

      onOpenHardware?.();
      print("[OK] Rendering interactive Airoha SoC chip in PCB hardware mode.");
      return;
    }

    if (command === "ping") {
      const target = args[0]?.toLowerCase();
      const pingTarget = pingTargets[target];

      if (!pingTarget) {
        print("ping: supported targets: linkedin, github, email");
        return;
      }

      const url = pingTarget.getUrl();

      if (!url) {
        print(`ping: ${target}: target not configured. Set NEXT_PUBLIC_CONTACT_EMAIL.`);
        return;
      }

      for (let sequence = 1; sequence <= 3; sequence += 1) {
        if (sequence > 1) {
          await delay(500);
        }

        const time = (10 + sequence * 3.7 + Math.random() * 2).toFixed(1);
        print(
          `64 bytes from ${pingTarget.host}: icmp_seq=${sequence} ttl=54 time=${time} ms`
        );
      }

      await delay(500);
      window.open(url, "_blank", "noopener,noreferrer");
      print(`[Connection Established] Opening ${pingTarget.label}.`);
      return;
    }

    if (command === "elixir") {
      const query = args.join(" ").trim();

      if (!query) {
        print("elixir: usage: elixir <kernel symbol or query>");
        return;
      }

      const url = `https://elixir.bootlin.com/linux/latest/ident/${encodeURIComponent(query)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      print(`[OK] Bootlin lookup opened for ${query}.`);
      return;
    }

    if (command === "play") {
      const target = args[0]?.toLowerCase();

      if (target && target !== "tux") {
        print("play: usage: play tux");
        return;
      }

      print("[OK] Launching Tux runner. Press ESC to return to terminal.");
      setGameActive(true);
      return;
    }

    if (command === "flash-ota") {
      await runFlashOta();
      return;
    }

    if (command === "sudo") {
      print("sudo: root shell is sandboxed in portfolio mode. This incident will be reported.");
      return;
    }

    if (command === "github") {
      window.open(resumeData.github, "_blank", "noopener,noreferrer");
      print(`[OK] Opening ${resumeData.github}`);
      return;
    }

    if (command === "emulator") {
      onOpenEmulator?.();
      print("[OK] Booting RISC-V Linux emulator overlay.");
      return;
    }

    print(`${command}: command not found. Type 'help' for available commands.`);
  };

  const completeInput = () => {
    const parts = input.split(/\s+/);
    const command = parts[0] ?? "";
    const active = parts[parts.length - 1] ?? "";

    if (command.toLowerCase() === "git" && parts.length > 1) {
      const matches = ["log"].filter((candidate) => candidate.startsWith(active));

      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(" "));
        return;
      }

      if (matches.length > 1) {
        print(matches.join("  "));
      }
      return;
    }

    if (["cat", "cd", "ls"].includes(command.toLowerCase()) && parts.length > 1) {
      const { matches, completion } = completePath(directory, active);

      if (completion) {
        parts[parts.length - 1] = completion;
        setInput(parts.join(" "));
        return;
      }

      if (matches.length > 1) {
        print(matches.join("  "));
      }
      return;
    }

    const candidates = getCompletionCandidates(directory);
    const matches = candidates.filter((candidate) => candidate.startsWith(active));

    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      setInput(parts.join(" "));
      return;
    }

    if (matches.length > 1) {
      print(matches.join("  "));
    }
  };

  const handleKeyDown = (event) => {
    if (isBusy) {
      event.preventDefault();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const command = input;
      setInput("");
      execute(command);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      completeInput();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex < 0 ? null : nextIndex);
      setInput(nextIndex < 0 ? "" : history[nextIndex]);
    }
  };

  if (gameActive) {
    return <TuxGame onExit={exitGame} />;
  }

  return (
    <div
      className={`h-full min-h-0 overflow-hidden bg-transparent text-[13px] leading-6 text-[color:var(--theme-text)] sm:text-sm ${
        panicMode ? "terminal-alert" : ""
      }`}
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <section
        ref={terminalRef}
        className="terminal-scrollbar h-full overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 sm:py-5"
        aria-label="Mayur Kumar terminal portfolio"
      >
        <div className="mx-auto min-h-full w-full max-w-6xl font-terminal">
          {lines.map((line) =>
            line.type === "command" ? (
              <div className="flex min-w-0 flex-wrap" key={line.id}>
                <Prompt directory={line.directory} />
                <span className="min-w-0 flex-1 break-words text-[color:var(--theme-text)]">
                  {line.content}
                </span>
              </div>
            ) : line.type === "help" ? (
              <HelpOutput key={line.id} />
            ) : line.type === "git-log" ? (
              <GitLogOutput entries={line.entries ?? []} key={line.id} />
            ) : line.animated ? (
              <Typewriter
                className="text-[color:var(--theme-text)]"
                key={line.id}
                speed={10}
                text={line.content}
              />
            ) : (
              <pre
                className="whitespace-pre-wrap break-words text-[color:var(--theme-text)]"
                key={line.id}
              >
                {line.content}
              </pre>
            )
          )}

          <div className="flex min-w-0 flex-wrap items-baseline">
            {prompt}
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="min-w-[8ch] flex-1 border-0 bg-transparent p-0 text-[color:var(--theme-text)] caret-[color:var(--theme-caret)] outline-none"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              disabled={isBusy}
              aria-label="Terminal command input"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
