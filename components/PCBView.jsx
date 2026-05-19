"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { resumeData } from "@/lib/resumeData";

const Chip3D = dynamic(() => import("@/components/Chip3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-transparent font-terminal text-[10px] uppercase tracking-[0.18em] text-amber-200">
      rendering ic
    </div>
  )
});

const nodeContent = {
  experience: {
    title: "Experience",
    subtitle: "Airoha firmware + kernel work",
    lines: [
      "Embedded Software Engineer | July 2024 - Present",
      "Built GPT support in ARM Trusted Firmware for EMMC flash.",
      "Integrated proprietary modules across Linux 6.6/6.12 and OpenWrt.",
      "Implemented SMC API for secure device authentication.",
      "Internship: upstreamed clk and watchdog Linux drivers."
    ]
  },
  projects: {
    title: "Projects",
    subtitle: "Mainline + secure boot architecture",
    lines: [
      "Upstream Linux Watchdog Driver",
      "Hardware watchdog merged into mainline v6.6+.",
      "Integrated CCF and Reset Controller APIs.",
      "SoC Partition Scheme",
      "GPT-based dynamic partitioning at EL3 / Secure Monitor."
    ]
  },
  education: {
    title: "Education",
    subtitle: "NIT Hamirpur",
    lines: [
      "Dual Degree (CSE)",
      "NIT Hamirpur | 2019 - 2024",
      "CGPA: 9.29/10.0",
      "Focus: systems, embedded Linux, kernel-facing platform work."
    ]
  }
};

const nodes = [
  {
    id: "experience",
    position:
      "left-[10%] top-[6%] sm:left-[4%] sm:top-1/2 sm:-translate-y-1/2",
    trace: "M 44 50 H 28 V 50 H 18"
  },
  {
    id: "projects",
    position:
      "right-[10%] top-[6%] sm:right-[4%] sm:top-1/2 sm:-translate-y-1/2",
    trace: "M 56 50 H 72 V 50 H 82"
  },
  {
    id: "education",
    position:
      "left-1/2 bottom-[15%] -translate-x-1/2 sm:bottom-[15%]",
    trace: "M 50 57 V 74 H 50 V 88"
  }
];

function DetailList({ lines }) {
  return (
    <ul className="mt-3 space-y-1 text-left text-[11px] leading-5 text-emerald-50/90">
      {lines.map((line) => (
        <li className="flex gap-2" key={line}>
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

function PeripheralNode({ node, selectedNode, onSelect }) {
  const content = nodeContent[node.id];
  const isSelected = selectedNode === node.id;
  const selectedPosition =
    node.id === "education"
      ? "left-1/2 bottom-3 -translate-x-1/2 sm:bottom-4"
      : node.position;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();

        if (!isSelected) {
          onSelect(node.id);
        }
      }}
      className={`absolute z-20 flex min-h-min h-auto w-32 flex-col justify-center rounded-sm border-2 border-amber-400/80 bg-slate-900/90 p-3 text-left font-terminal text-emerald-50 shadow-[0_0_24px_rgba(251,191,36,0.22)] transition-all duration-300 hover:border-amber-200 hover:shadow-[0_0_34px_rgba(251,191,36,0.45)] sm:w-36 ${
        isSelected ? selectedPosition : node.position
      } ${
        isSelected
          ? "z-50 max-h-32 w-[min(18rem,calc(100vw-2rem))] justify-start overflow-y-auto border-amber-200 bg-slate-950 shadow-[0_0_46px_rgba(251,191,36,0.55)] sm:max-h-36 sm:w-72"
          : ""
      }`}
      aria-expanded={isSelected}
    >
      <span className="text-[10px] uppercase tracking-[0.18em] text-amber-300">
        node
      </span>
      <span className="mt-1 text-sm font-bold">{content.title}</span>
      <span className="mt-1 text-[10px] leading-4 text-emerald-100/70">
        {content.subtitle}
      </span>
      {isSelected ? <DetailList lines={content.lines} /> : null}
    </button>
  );
}

export default function PCBView() {
  const [selectedNode, setSelectedNode] = useState(null);
  const skills = useMemo(() => resumeData.skills.slice(0, 7), []);

  return (
    <section
      onClick={() => setSelectedNode(null)}
      className="relative h-full min-h-0 overflow-hidden bg-emerald-950 font-terminal text-emerald-50"
      style={{
        backgroundImage:
          "linear-gradient(rgba(251,191,36,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px"
      }}
      aria-label="PCB hardware portfolio view"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_58%)]" />

      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full text-amber-400/80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {nodes.map((node) => (
          <path
            d={node.trace}
            fill="none"
            key={node.id}
            stroke="currentColor"
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="0.55"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d="M28 50 H44 M56 50 H72 M50 57 V88"
          fill="none"
          stroke="rgba(251,191,36,0.35)"
          strokeDasharray="2 2"
          strokeWidth="0.28"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute left-1/2 top-[43%] z-20 flex h-auto max-h-[68%] min-h-min w-[min(31rem,78vw)] -translate-x-1/2 -translate-y-1/2 flex-col justify-center overflow-hidden rounded-sm border-4 border-amber-500 bg-neutral-900/95 p-5 text-center shadow-[0_0_55px_rgba(245,158,11,0.45)] sm:top-[42%] sm:p-6"
      >
        <span className="mx-auto mb-3 h-2 w-20 rounded-full bg-amber-400/80" />
        <h1 className="text-xl font-black text-amber-200 sm:text-3xl">
          {resumeData.name}
        </h1>
        <p className="mt-1 text-sm font-semibold text-emerald-200">
          {resumeData.title}
        </p>
        <p className="mt-4 text-xs leading-5 text-emerald-50/85 sm:text-sm sm:leading-6">
          {resumeData.summary}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {skills.map((skill) => (
            <span
              className="rounded-sm border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 text-[10px] uppercase leading-none text-amber-100"
              key={skill}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {nodes.map((node) => (
        <PeripheralNode
          key={node.id}
          node={node}
          onSelect={setSelectedNode}
          selectedNode={selectedNode}
        />
      ))}

      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute bottom-3 right-3 z-30 h-28 w-40 sm:bottom-4 sm:right-4 sm:h-44 sm:w-60 lg:h-56 lg:w-72"
      >
        <Chip3D />
      </div>

      <div className="absolute bottom-3 left-3 z-30 rounded-sm border border-amber-400/40 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-amber-200 backdrop-blur">
        pcb-node mode
      </div>
    </section>
  );
}
