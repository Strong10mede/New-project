"use client";

import { useEffect, useState } from "react";

const hints = [
  "Hint: type whoami to learn about my background.",
  "Hint: type ls, then cd into skills/ or projects/.",
  "Hint: cat projects/watchdog.txt shows upstream kernel work.",
  "Hint: wget resume.pdf downloads Mayur's CV.",
  "Hint: type emulator to boot a tiny Linux machine.",
  "Hint: type clear to clean the screen."
];

function getRandomHint(currentHint) {
  const nextHints = hints.filter((hint) => hint !== currentHint);
  return nextHints[Math.floor(Math.random() * nextHints.length)];
}

export default function TuxAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState(hints[0]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timer = window.setInterval(() => {
      setHint((current) => getRandomHint(current));
    }, 3600);

    return () => window.clearInterval(timer);
  }, [isOpen]);

  return (
    <div className="fixed bottom-3 right-3 z-30 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="max-w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-[color:var(--theme-border)] bg-black/55 px-3 py-2 font-terminal text-xs leading-5 text-[color:var(--theme-text)] shadow-[0_18px_60px_var(--theme-shadow)] backdrop-blur-md">
          {hint}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          setHint((current) => getRandomHint(current));
        }}
        className="grid h-16 w-16 place-items-center rounded-lg border border-[color:var(--theme-border)] bg-black/45 text-[color:var(--theme-accent)] shadow-[0_18px_60px_var(--theme-shadow)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
        aria-expanded={isOpen}
        aria-label="Toggle Tux terminal assistant"
      >
        <pre className="select-none text-center font-terminal text-[10px] leading-[10px]">
{` .--.
(o_o)
/( )\\
 ^^ `}
        </pre>
      </button>
    </div>
  );
}
