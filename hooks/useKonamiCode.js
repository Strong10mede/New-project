"use client";

import { useEffect, useRef } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
];

export function useKonamiCode(onUnlock) {
  const progressRef = useRef(0);
  const onUnlockRef = useRef(onUnlock);

  useEffect(() => {
    onUnlockRef.current = onUnlock;
  }, [onUnlock]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expectedKey = KONAMI_SEQUENCE[progressRef.current];

      if (key === expectedKey) {
        progressRef.current += 1;

        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0;
          onUnlockRef.current?.();
        }

        return;
      }

      progressRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
