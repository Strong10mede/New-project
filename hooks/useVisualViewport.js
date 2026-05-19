"use client";

import { useEffect, useMemo, useState } from "react";

const fallbackViewport = {
  height: null,
  width: null,
  offsetTop: 0,
  offsetLeft: 0
};

export function useVisualViewport() {
  const [viewport, setViewport] = useState(fallbackViewport);

  useEffect(() => {
    let frameId = null;

    const readViewport = () => {
      const visualViewport = window.visualViewport;

      setViewport({
        height: visualViewport?.height ?? window.innerHeight,
        width: visualViewport?.width ?? window.innerWidth,
        offsetTop: visualViewport?.offsetTop ?? 0,
        offsetLeft: visualViewport?.offsetLeft ?? 0
      });
    };

    const scheduleRead = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        readViewport();
      });
    };

    readViewport();

    window.visualViewport?.addEventListener("resize", scheduleRead);
    window.visualViewport?.addEventListener("scroll", scheduleRead);
    window.addEventListener("orientationchange", scheduleRead);
    window.addEventListener("resize", scheduleRead);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.visualViewport?.removeEventListener("resize", scheduleRead);
      window.visualViewport?.removeEventListener("scroll", scheduleRead);
      window.removeEventListener("orientationchange", scheduleRead);
      window.removeEventListener("resize", scheduleRead);
    };
  }, []);

  return useMemo(
    () => ({
      ...viewport,
      cssVariables: {
        "--visual-viewport-height": viewport.height
          ? `${viewport.height}px`
          : "100dvh",
        "--visual-viewport-width": viewport.width ? `${viewport.width}px` : "100vw",
        "--visual-viewport-offset-top": `${viewport.offsetTop}px`,
        "--visual-viewport-offset-left": `${viewport.offsetLeft}px`
      }
    }),
    [viewport]
  );
}
