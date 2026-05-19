"use client";

import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  speed = 10,
  className = "",
  onDone
}) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setVisibleCharacters(0);
    setIsDone(false);
  }, [text]);

  useEffect(() => {
    if (isDone) return undefined;

    if (visibleCharacters >= text.length) {
      setIsDone(true);
      onDone?.();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setVisibleCharacters((current) => Math.min(current + 1, text.length));
    }, speed);

    return () => window.clearTimeout(timer);
  }, [isDone, onDone, speed, text.length, visibleCharacters]);

  useEffect(() => {
    if (isDone) return undefined;

    const skip = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      event.stopPropagation();
      setVisibleCharacters(text.length);
      setIsDone(true);
      onDone?.();
    };

    window.addEventListener("keydown", skip, { capture: true });

    return () => {
      window.removeEventListener("keydown", skip, { capture: true });
    };
  }, [isDone, onDone, text.length]);

  return (
    <pre className={`whitespace-pre-wrap break-words ${className}`}>
      {text.slice(0, visibleCharacters)}
      {!isDone ? (
        <span className="inline-block h-4 w-2 animate-pulse bg-[color:var(--theme-accent)] align-[-2px]" />
      ) : null}
    </pre>
  );
}
