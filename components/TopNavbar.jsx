"use client";

import { useEffect, useMemo, useState } from "react";
import { resumeData } from "@/lib/resumeData";
import ThemeSwitcher from "@/components/ThemeSwitcher";

function UsageBar({ label, value }) {
  const bars = useMemo(() => Array.from({ length: 10 }, (_, index) => index), []);
  const activeBars = Math.round(value / 10);

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[color:var(--theme-muted)]">{label}</span>
      <div
        className="flex h-3 w-16 items-center gap-0.5"
        aria-label={`${label} usage ${value}%`}
      >
        {bars.map((bar) => (
          <span
            className={`h-full flex-1 rounded-[1px] ${
              bar < activeBars
                ? "bg-[color:var(--theme-accent)]"
                : "bg-white/10"
            }`}
            key={bar}
          />
        ))}
      </div>
      <span className="w-8 tabular-nums">{value}%</span>
    </div>
  );
}

function ViewToggle({ activeView, onViewChange }) {
  const isHardware = activeView === "hardware";

  return (
    <button
      type="button"
      onClick={() => onViewChange(isHardware ? "terminal" : "hardware")}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
      role="switch"
      aria-checked={isHardware}
      aria-label="Switch between terminal mode and hardware mode"
    >
      <span className="hidden min-w-[4.35rem] text-left text-[10px] font-semibold uppercase leading-none text-[color:var(--theme-muted)] lg:inline">
        {isHardware ? "Hardware" : "Terminal"}
      </span>
      <span className="relative inline-flex h-5 w-10 shrink-0 items-center rounded-full border border-[color:var(--theme-border)] bg-black/70 p-0.5 shadow-inner">
        <span
          className={`h-3.5 w-3.5 rounded-full bg-[color:var(--theme-accent)] shadow-[0_0_14px_var(--theme-shadow)] transition-transform duration-200 ${
            isHardware ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export default function TopNavbar({ activeView = "terminal", onViewChange = () => {} }) {
  const [clock, setClock] = useState("");
  const [usage, setUsage] = useState({ cpu: 18, ram: 42 });

  useEffect(() => {
    const tickClock = () => {
      setClock(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(new Date())
      );
    };

    tickClock();
    const timer = window.setInterval(tickClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const fluctuate = () => {
      setUsage((current) => ({
        cpu: Math.max(8, Math.min(78, current.cpu + Math.round(Math.random() * 12 - 6))),
        ram: Math.max(28, Math.min(84, current.ram + Math.round(Math.random() * 8 - 4)))
      }));
    };

    const timer = window.setInterval(fluctuate, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/30 px-3 py-2 font-terminal text-xs text-[color:var(--theme-text)] shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 overflow-hidden">
          <span className="hidden rounded border border-white/10 bg-white/5 px-2 py-1 text-[color:var(--theme-accent)] sm:inline">
            {clock}
          </span>
          <div className="flex min-w-0 items-center gap-3 overflow-x-auto whitespace-nowrap">
            <UsageBar label="CPU" value={usage.cpu} />
            <UsageBar label="RAM" value={usage.ram} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ViewToggle activeView={activeView} onViewChange={onViewChange} />
          <a
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-accent)] hover:text-[color:var(--theme-accent)]"
            href="/Mayur_Resume.pdf"
            download
          >
            Download CV
          </a>
          <a
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[color:var(--theme-text)] transition hover:border-[color:var(--theme-accent)] hover:text-[color:var(--theme-accent)]"
            href={resumeData.github}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
