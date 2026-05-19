"use client";

import { useEffect, useState } from "react";

const EMULATOR_URL =
  "https://bellard.org/jslinux/vm.html?cpu=riscv64&url=buildroot-riscv64.cfg&mem=256";

const bootProfiles = {
  linux: {
    label: "Simulate Linux v6.6 Boot",
    lines: [
      "[0.0000] Linux version 6.6.10-mainline (mayur@build) #1 SMP PREEMPT",
      "[0.0381] OF: fdt: Machine model: Mayur RISC-V virtual board",
      "[0.1200] smp: Brought up 4 nodes, 4 CPUs",
      "[0.2442] clocksource: riscv_clocksource initialized",
      "[0.3180] mmc0: new high speed SDHC card",
      "[0.4501] watchdog: hardware watchdog registered",
      "[0.7004] EXT4-fs (vda): mounted filesystem with ordered data mode",
      "[1.0500] VFS: Mounted root (ext4) readonly on device 254:0",
      "[1.3302] init: starting /sbin/init"
    ]
  },
  openwrt: {
    label: "Simulate OpenWrt Boot",
    lines: [
      "U-Boot 2021.04 (Mayur OpenWrt lab)",
      "DRAM: 256 MiB",
      "MMC: emmc@0: 0",
      "Loading kernel from FIT image...",
      "Booting OpenWrt 21.02-RELEASE...",
      "[    0.000000] Linux version 5.4.143",
      "procd: - early -",
      "procd: - watchdog -",
      "netifd: radio and bridge bring-up pending",
      "root@OpenWrt:/#"
    ]
  }
};

export default function EmulatorModal({ isOpen, onClose }) {
  const [bootState, setBootState] = useState({
    isBooting: false,
    visibleLines: [],
    profile: null
  });

  useEffect(() => {
    if (!bootState.isBooting || !bootState.profile) return undefined;

    const profile = bootProfiles[bootState.profile];
    const lineTimer = window.setInterval(() => {
      setBootState((current) => {
        if (!current.isBooting || current.visibleLines.length >= profile.lines.length) {
          window.clearInterval(lineTimer);
          return current;
        }

        return {
          ...current,
          visibleLines: [...current.visibleLines, profile.lines[current.visibleLines.length]]
        };
      });
    }, 130);

    const finishTimer = window.setTimeout(() => {
      setBootState({
        isBooting: false,
        visibleLines: [],
        profile: null
      });
    }, 3500);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(finishTimer);
    };
  }, [bootState.isBooting, bootState.profile]);

  if (!isOpen) return null;

  const startBoot = (profile) => {
    setBootState({
      isBooting: true,
      visibleLines: [],
      profile
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex h-[var(--visual-viewport-height,100dvh)] items-center justify-center bg-black/92 p-3 text-[color:var(--theme-text)] backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Linux emulator"
    >
      <section className="flex h-[min(46rem,calc(var(--visual-viewport-height,100dvh)-1.5rem))] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-terminal)] shadow-[0_28px_90px_var(--theme-shadow)] backdrop-blur-xl sm:h-[min(50rem,calc(var(--visual-viewport-height,100dvh)-3rem))]">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[color:var(--theme-border)] bg-[color:var(--theme-terminal-strong)] px-4">
          <span className="truncate text-sm font-semibold text-[color:var(--theme-accent)]">
            JSLinux RISC-V Emulator
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[color:var(--theme-border)] px-3 py-1.5 text-xs font-semibold uppercase text-[color:var(--theme-text)] transition hover:bg-[color:var(--theme-accent)] hover:text-black focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
          >
            Close [X]
          </button>
        </div>

        <div className="flex shrink-0 flex-wrap justify-center gap-2 border-b border-white/10 bg-black/45 px-4 py-3">
          {Object.entries(bootProfiles).map(([key, profile]) => (
            <button
              type="button"
              className="rounded-md border border-[color:var(--theme-border)] px-3 py-2 text-xs font-semibold text-[color:var(--theme-text)] transition hover:bg-[color:var(--theme-accent)] hover:text-black focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
              key={key}
              onClick={() => startBoot(key)}
            >
              {profile.label}
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-5">
          <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-lg border-8 border-gray-900 bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_90px_rgba(0,0,0,0.65)]">
            <div className="shrink-0 border-b border-yellow-500/20 bg-yellow-500/10 px-3 py-2 font-terminal text-[11px] leading-5 text-yellow-200 sm:px-4 sm:text-xs">
              <span className="text-yellow-300" aria-hidden="true">
                [!]
              </span>{" "}
              <span className="font-semibold text-yellow-300">
                [ SYSTEM ARCHITECTURE NOTE ]:
              </span>{" "}
              To ensure sub-second browser load times, this web sandbox falls back to a lightweight JSLinux Buildroot environment (Kernel 4.15). Native Linux 6.6 and OpenWrt environments are tested locally on physical ARM SoC hardware.
            </div>
            {bootState.isBooting ? (
              <div className="min-h-0 flex-1 overflow-hidden bg-black p-4 font-terminal text-xs leading-6 text-[#00ff88] sm:text-sm">
                {bootState.visibleLines.map((line) => (
                  <pre className="whitespace-pre-wrap break-words" key={line}>
                    {line}
                  </pre>
                ))}
                <span className="mt-2 inline-block h-4 w-2 animate-pulse bg-[#00ff88]" />
              </div>
            ) : (
              <iframe
                title="JSLinux RISC-V emulator"
                src={EMULATOR_URL}
                className="min-h-0 flex-1 border-0 bg-black"
                allow="clipboard-read; clipboard-write; fullscreen"
                scrolling="no"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
