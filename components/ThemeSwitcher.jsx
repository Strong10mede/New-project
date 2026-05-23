"use client";

import { useEffect, useRef, useState } from "react";
import { DistroSymbol, useTheme } from "@/components/ThemeProvider";

export default function ThemeSwitcher({ className = "" }) {
  const { isThemeBooting, requestThemeChange, theme, themeId, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const selectedTheme = themes[themeId];

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-8 min-w-0 items-center justify-between gap-1.5 rounded-md border border-white/10 bg-black/45 px-2 text-left text-[11px] font-semibold uppercase tracking-normal text-[color:var(--theme-text)] outline-none backdrop-blur-xl transition hover:border-[color:var(--theme-accent)] hover:text-[color:var(--theme-accent)] focus:ring-2 focus:ring-[color:var(--theme-accent)] sm:h-9 sm:min-w-[6.4rem] sm:gap-2 sm:px-3 sm:text-xs"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Switch Linux terminal theme"
      >
        <span className="flex items-center gap-2">
          <DistroSymbol
            className="h-4 w-4"
            color={theme.colors.accent}
            id={selectedTheme.id}
          />
          <span className="hidden min-[390px]:inline">{selectedTheme.shortLabel}</span>
        </span>
        <span className="text-[color:var(--theme-accent)]" aria-hidden="true">
          v
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-[calc(100%+0.45rem)] z-50 w-36 overflow-hidden rounded-md border border-[color:var(--theme-border)] bg-[#050505] p-1 text-xs shadow-[0_18px_60px_var(--theme-shadow)] backdrop-blur-xl"
          role="listbox"
          aria-label="Linux terminal themes"
        >
          {Object.values(themes).map((themeOption) => (
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-left font-semibold text-white transition hover:bg-white/10 ${
                themeOption.id === themeId ? "bg-white/10" : ""
              }`}
              key={themeOption.id}
              onClick={() => {
                requestThemeChange(themeOption.id);
                setIsOpen(false);
              }}
              disabled={isThemeBooting}
              role="option"
              aria-selected={themeOption.id === themeId}
            >
              <span className="flex items-center gap-2">
                <DistroSymbol
                  className="h-4 w-4"
                  color={themeOption.colors.accent}
                  id={themeOption.id}
                />
                {themeOption.label}
              </span>
              {themeOption.id === themeId ? (
                <span style={{ color: theme.colors.accent }}>*</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
