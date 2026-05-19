"use client";

import HeaderAvatar from "@/components/HeaderAvatar";

export default function DesktopWindow({ title, children }) {
  return (
    <section className="flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-terminal)] shadow-[0_28px_90px_var(--theme-shadow)] backdrop-blur-xl">
      <header className="relative flex h-12 shrink-0 items-center justify-center border-b border-[color:var(--theme-border)] bg-[color:var(--theme-titlebar)] px-4">
        <div className="absolute left-4 flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[0_0_12px_rgba(255,95,87,0.55)]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_12px_rgba(255,189,46,0.45)]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_12px_rgba(40,200,64,0.45)]" />
        </div>

        <div className="flex max-w-[62vw] items-center justify-center gap-2 truncate text-center sm:max-w-none">
          <HeaderAvatar />
          <p className="truncate text-xs font-semibold text-[color:var(--theme-muted)]">
            {title}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </section>
  );
}
