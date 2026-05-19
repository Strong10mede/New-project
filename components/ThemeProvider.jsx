"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export const themes = {
  kali: {
    id: "kali",
    label: "Kali Linux",
    shortLabel: "Kali",
    sound: "/startup-kali.mp3",
    colors: {
      page: "#000000",
      terminal: "rgba(5, 5, 5, 0.78)",
      terminalStrong: "rgba(0, 0, 0, 0.9)",
      titlebar: "rgba(12, 14, 15, 0.82)",
      border: "rgba(0, 255, 136, 0.34)",
      text: "#d5fff1",
      muted: "#8aa0a8",
      accent: "#00ff88",
      accent2: "#ff405d",
      promptUser: "#00ff88",
      promptHost: "#2aa7ff",
      caret: "#00ff88",
      matrix: "#00ff88",
      matrixFade: "rgba(0, 0, 0, 0.11)",
      shadow: "rgba(0, 255, 136, 0.17)",
      selection: "rgba(42, 167, 255, 0.32)"
    }
  },
  ubuntu: {
    id: "ubuntu",
    label: "Ubuntu",
    shortLabel: "Ubuntu",
    sound: "/startup-ubuntu.mp3",
    colors: {
      page: "#170f24",
      terminal: "rgba(29, 18, 39, 0.8)",
      terminalStrong: "rgba(19, 12, 29, 0.94)",
      titlebar: "rgba(42, 26, 52, 0.84)",
      border: "rgba(255, 140, 26, 0.38)",
      text: "#f8f0e3",
      muted: "#c7b5d5",
      accent: "#ff8c1a",
      accent2: "#ffffff",
      promptUser: "#ffffff",
      promptHost: "#ff8c1a",
      caret: "#ff8c1a",
      matrix: "#ff8c1a",
      matrixFade: "rgba(23, 15, 36, 0.12)",
      shadow: "rgba(255, 100, 15, 0.22)",
      selection: "rgba(255, 140, 26, 0.32)"
    }
  },
  parrot: {
    id: "parrot",
    label: "Parrot OS",
    shortLabel: "Parrot",
    sound: "/startup-parrot.mp3",
    colors: {
      page: "#071118",
      terminal: "rgba(6, 18, 26, 0.8)",
      terminalStrong: "rgba(4, 12, 18, 0.94)",
      titlebar: "rgba(9, 28, 40, 0.84)",
      border: "rgba(39, 247, 255, 0.34)",
      text: "#d8fbff",
      muted: "#8ab7c4",
      accent: "#27f7ff",
      accent2: "#79ffe1",
      promptUser: "#79ffe1",
      promptHost: "#27f7ff",
      caret: "#27f7ff",
      matrix: "#27f7ff",
      matrixFade: "rgba(7, 17, 24, 0.12)",
      shadow: "rgba(39, 247, 255, 0.18)",
      selection: "rgba(39, 247, 255, 0.28)"
    }
  }
};

const ThemeContext = createContext(null);

const classifiedTheme = {
  id: "classified",
  label: "Top Secret",
  shortLabel: "Secret",
  sound: "/access_granted.mp3",
  colors: {
    page: "#030000",
    terminal: "rgba(18, 0, 0, 0.86)",
    terminalStrong: "rgba(8, 0, 0, 0.96)",
    titlebar: "rgba(35, 0, 0, 0.9)",
    border: "rgba(255, 32, 32, 0.46)",
    text: "#ffe4e4",
    muted: "#ff8b8b",
    accent: "#ff2020",
    accent2: "#ffffff",
    promptUser: "#ff2020",
    promptHost: "#ffffff",
    caret: "#ff2020",
    matrix: "#ff2020",
    matrixFade: "rgba(3, 0, 0, 0.16)",
    shadow: "rgba(255, 32, 32, 0.28)",
    selection: "rgba(255, 32, 32, 0.34)"
  }
};

export function DistroSymbol({ id, color = "currentColor", className = "" }) {
  if (id === "ubuntu") {
    return (
      <svg
        className={className}
        viewBox="0 0 120 120"
        role="img"
        aria-label="Ubuntu symbol"
      >
        <circle cx="60" cy="60" r="28" fill="none" stroke={color} strokeWidth="10" />
        <circle cx="60" cy="16" r="12" fill={color} />
        <circle cx="98" cy="82" r="12" fill={color} />
        <circle cx="22" cy="82" r="12" fill={color} />
        <path
          d="M60 28V46M86 74 71 66M34 74 49 66"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="9"
        />
      </svg>
    );
  }

  if (id === "parrot") {
    return (
      <svg
        className={className}
        viewBox="0 0 120 120"
        role="img"
        aria-label="Parrot OS symbol"
      >
        <path
          d="M22 86C35 37 72 16 103 26 78 34 75 53 88 67 68 65 51 77 42 101 37 93 31 88 22 86Z"
          fill="none"
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="9"
        />
        <path
          d="M47 74C58 52 75 43 96 43M39 91C49 72 65 62 84 60"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="6"
        />
        <circle cx="85" cy="34" r="4" fill={color} />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Kali Linux symbol"
    >
      <path
        d="M18 82C30 48 59 26 103 20 86 35 78 51 82 67 66 61 48 68 34 96"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9"
      />
      <path
        d="M36 73 60 80 45 94M62 44 76 39M56 56 78 54"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d="M86 27 103 20 96 37"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
    </svg>
  );
}

function playStartupSound(themeConfig) {
  try {
    const audio = new Audio(themeConfig.sound || "/startup.mp3");
    audio.volume = 0.42;
    audio.play().catch(() => {});
  } catch {
    // Browsers can reject audio for policy reasons; the visual transition still runs.
  }
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState("kali");
  const [bootThemeId, setBootThemeId] = useState(null);
  const [isClassifiedMode, setIsClassifiedMode] = useState(false);
  const bootTimerRef = useRef(null);
  const theme = isClassifiedMode ? classifiedTheme : themes[themeId];
  const bootTheme = bootThemeId ? themes[bootThemeId] : null;

  const cssVariables = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(theme.colors).map(([key, value]) => [
          `--theme-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`,
          value
        ])
      ),
    [theme]
  );

  const requestThemeChange = useCallback(
    (nextThemeId) => {
      if (!themes[nextThemeId]) return;
      if (nextThemeId === themeId && !bootThemeId) return;

      window.clearTimeout(bootTimerRef.current);
      playStartupSound(themes[nextThemeId]);
      setBootThemeId(nextThemeId);

      bootTimerRef.current = window.setTimeout(() => {
        setThemeId(nextThemeId);
        setIsClassifiedMode(false);
        setBootThemeId(null);
      }, 1500);
    },
    [bootThemeId, themeId]
  );

  const activateClassifiedMode = useCallback(() => {
    playStartupSound(classifiedTheme);
    setIsClassifiedMode(true);
  }, []);

  const deactivateClassifiedMode = useCallback(() => {
    setIsClassifiedMode(false);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(bootTimerRef.current);
    },
    []
  );

  return (
    <ThemeContext.Provider
      value={{
        activateClassifiedMode,
        bootTheme,
        classifiedTheme,
        deactivateClassifiedMode,
        isClassifiedMode,
        isThemeBooting: Boolean(bootThemeId),
        requestThemeChange,
        setThemeId,
        theme,
        themeId,
        themes
      }}
    >
      <div
        className="portfolio-root min-h-[100dvh]"
        data-classified={isClassifiedMode ? "true" : "false"}
        data-theme={theme.id}
        style={cssVariables}
      >
        {children}
        {bootTheme ? (
          <div className="theme-boot-overlay fixed inset-0 z-50 grid place-items-center bg-black">
            <div
              className="theme-boot-symbol flex flex-col items-center gap-5"
              style={{ color: bootTheme.colors.accent }}
            >
              <DistroSymbol
                className="h-28 w-28 sm:h-44 sm:w-44"
                color="currentColor"
                id={bootTheme.id}
              />
              <span className="font-terminal text-xs uppercase tracking-[0.28em] text-[color:var(--theme-muted)]">
                {bootTheme.label}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
