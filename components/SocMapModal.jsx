"use client";

const coreBlock = {
  title: "Core Unit",
  body: "ARM Cortex CPU (AArch64)"
};

const leftBlocks = [
  {
    title: "Secure Enclave",
    body: "ARM TrustZone (EL3) - SMC API & EFUSE Handlers"
  },
  {
    title: "Peripherals",
    body: "I2C / SPI / UART Buses"
  }
];

const rightBlocks = [
  {
    title: "Storage Interface",
    body: "eMMC / Flash - GPT Partition Scheme"
  },
  {
    title: "System Control",
    body: "Clock (CCF) & Hardware Watchdog"
  }
];

function DiagramCard({ title, body }) {
  return (
    <div className="relative z-10 min-h-min h-auto rounded-md border border-[color:var(--theme-border)] bg-black/55 p-4 shadow-[inset_0_0_32px_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:border-[color:var(--theme-accent)] hover:bg-black/75">
      <p className="text-xs uppercase text-[color:var(--theme-muted)]">
        {title}
      </p>
      <p className="mt-2 break-words text-sm font-bold leading-6 text-[color:var(--theme-text)]">
        {body}
      </p>
      <span className="mt-4 block h-1 rounded-full bg-[color:var(--theme-accent)] opacity-70" />
    </div>
  );
}

export default function SocMapModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-4 text-[color:var(--theme-text)] backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="System-on-Chip block diagram"
    >
      <section className="w-full max-w-4xl overflow-hidden rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-terminal-strong)] shadow-[0_28px_90px_var(--theme-shadow)]">
        <header className="flex items-center justify-between border-b border-[color:var(--theme-border)] px-4 py-3">
          <div>
            <p className="text-xs uppercase text-[color:var(--theme-muted)]">
              mayur-soc-map.dts
            </p>
            <h2 className="text-base font-semibold text-[color:var(--theme-accent)]">
              System-on-Chip Block Diagram
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[color:var(--theme-border)] px-3 py-1.5 text-xs font-semibold uppercase transition hover:bg-[color:var(--theme-accent)] hover:text-black focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
          >
            Close [X]
          </button>
        </header>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-8">
            <div className="relative flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(16rem,1.15fr)_minmax(0,1fr)] sm:items-stretch sm:gap-6">
              <div className="pointer-events-none absolute left-1/2 top-20 hidden h-[calc(100%-8rem)] -translate-x-1/2 border-l border-dashed border-[color:var(--theme-accent)] opacity-70 sm:block" />
              <div className="pointer-events-none absolute left-[16%] right-[16%] top-[33%] hidden border-t border-dashed border-[color:var(--theme-accent)] opacity-70 sm:block" />
              <div className="pointer-events-none absolute left-[16%] right-[16%] top-[72%] hidden border-t border-dashed border-[color:var(--theme-accent)] opacity-70 sm:block" />

              <div className="flex min-h-min flex-col gap-4 sm:gap-6">
                {leftBlocks.map((block) => (
                  <DiagramCard body={block.body} key={block.title} title={block.title} />
                ))}
              </div>

              <div className="relative z-10 flex min-h-min flex-col gap-4 sm:justify-center">
                <DiagramCard body={coreBlock.body} title={coreBlock.title} />
                <div className="rounded-md border border-dashed border-[color:var(--theme-accent)] bg-[color:var(--theme-accent)]/10 p-3 text-center text-xs font-bold uppercase text-[color:var(--theme-accent)]">
                  AXI / APB interconnect fabric
                </div>
              </div>

              <div className="flex min-h-min flex-col gap-4 sm:gap-6">
                {rightBlocks.map((block) => (
                  <DiagramCard body={block.body} key={block.title} title={block.title} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-xs text-[color:var(--theme-muted)] sm:grid sm:grid-cols-3">
              <p className="rounded border border-white/10 bg-white/5 p-3">
                secure monitor: SMC conduit
              </p>
              <p className="rounded border border-white/10 bg-white/5 p-3">
                kernel: v6.6+ driver patches
              </p>
              <p className="rounded border border-white/10 bg-white/5 p-3">
                storage: GPT-aware boot flow
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
