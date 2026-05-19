"use client";

import { useEffect } from "react";
import { resumeData } from "@/lib/resumeData";

const classifiedProjects = [
  {
    label: "ARM TrustZone EL3 Storage Path",
    detail: "GPT partition scheme, Secure Monitor integration, and SMC API work."
  },
  {
    label: "Mainline Linux Watchdog Driver",
    detail: "Hardware watchdog driver merged into Linux v6.6+ with CCF/reset APIs."
  },
  {
    label: "OpenWrt Kernel Integration",
    detail: "Proprietary module integration across Linux 6.6/6.12 and OpenWrt releases."
  }
];

export default function ClassifiedModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="classified-modal fixed inset-0 z-[70] flex items-center justify-center bg-black/88 px-4 font-terminal text-red-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Classified clearance accepted"
    >
      <div className="classified-panel relative w-full max-w-3xl overflow-hidden rounded-sm border border-red-500/70 bg-[#090000] p-5 shadow-[0_0_90px_rgba(255,0,0,0.38)] sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-red-500 shadow-[0_0_32px_rgba(255,0,0,0.8)]" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded border border-red-500/50 bg-red-950/70 px-2 py-1 text-xs uppercase tracking-[0.18em] text-red-100 transition hover:border-red-200 hover:text-white"
        >
          close
        </button>

        <p className="text-xs uppercase tracking-[0.38em] text-red-400">
          top secret node
        </p>
        <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.14em] text-red-100 sm:text-4xl">
          Classified Clearance Accepted
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-red-100/75">
          Authorized portfolio override for {resumeData.name}. Hardware project
          access is now visible in red-team review mode.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {classifiedProjects.map((project) => (
            <article
              className="rounded-sm border border-red-500/40 bg-red-950/20 p-4 shadow-[inset_0_0_24px_rgba(255,0,0,0.08)]"
              key={project.label}
            >
              <h3 className="text-sm font-bold uppercase leading-5 text-red-100">
                {project.label}
              </h3>
              <p className="mt-3 text-xs leading-5 text-red-100/70">
                {project.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 border-t border-red-500/30 pt-4 text-xs uppercase tracking-[0.22em] text-red-300">
          audit: konami clearance event accepted
        </div>
      </div>
    </div>
  );
}
