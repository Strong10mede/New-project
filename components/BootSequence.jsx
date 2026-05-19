"use client";

import { useEffect, useState } from "react";

const bootLog = [
  "[0.000000] Linux version 6.6-custom-mayur (gcc 13.2.0) #1 SMP PREEMPT_DYNAMIC",
  "[0.028441] EFI: UEFI firmware handoff complete",
  "[0.064002] OF: fdt: Machine model: Mayur virtual desktop",
  "[0.123000] mmc0: mounted GPT root filesystem",
  "[0.186740] trusted-firmware-a: EL3 secure monitor online",
  "[0.252312] arm-smccc: SMC conduit initialized",
  "[0.341880] watchdog: upstream driver registered",
  "[0.438902] net: root interface ready",
  "[0.550000] Starting GUI compositor...",
  "[0.743901] Launching terminal workspace",
  "[1.002448] Matrix background service active",
  "[1.337000] Welcome, root"
];

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    const lineTimer = window.setInterval(() => {
      setVisibleLines((current) => {
        if (current.length >= bootLog.length) {
          window.clearInterval(lineTimer);
          return current;
        }

        return [...current, bootLog[current.length]];
      });
    }, 110);

    const completeTimer = window.setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <main className="flex h-[100dvh] w-screen items-start justify-start overflow-hidden bg-black p-4 font-terminal text-xs leading-6 text-[#00ff88] sm:p-8 sm:text-sm">
      <div className="w-full max-w-5xl">
        <p className="mb-4 text-[#d5fff1]">MayurBIOS v2.4.10</p>
        {visibleLines.map((line) => (
          <pre className="whitespace-pre-wrap break-words" key={line}>
            {line}
          </pre>
        ))}
        <span className="mt-2 inline-block h-4 w-2 animate-pulse bg-[#00ff88]" />
      </div>
    </main>
  );
}
