"use client";

import HeaderAvatar from "@/components/HeaderAvatar";

export default function DesktopWindow({ title, children }) {
  return (
    <section className="flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-md border border-[color:var(--theme-border)] bg-[color:var(--theme-terminal)] shadow-[0_18px_64px_var(--theme-shadow)] backdrop-blur-xl sm:rounded-lg sm:shadow-[0_28px_90px_var(--theme-shadow)]">
      <header className="relative flex h-11 shrink-0 items-center justify-center border-b border-[color:var(--theme-border)] bg-[color:var(--theme-titlebar)] px-3 sm:h-12 sm:px-4">
        <div className="absolute left-3 flex items-center gap-1.5 sm:left-4 sm:gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_12px_rgba(255,95,87,0.55)] sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_12px_rgba(255,189,46,0.45)] sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[0_0_12px_rgba(40,200,64,0.45)] sm:h-3 sm:w-3" />
        </div>

        <div className="flex max-w-[58vw] items-center justify-center gap-1.5 truncate text-center sm:max-w-none sm:gap-2">
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
