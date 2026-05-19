"use client";

import { useState } from "react";
import Image from "next/image";

export default function HeaderAvatar({ src = "/mayur-photo.png" }) {
  const [hasImage, setHasImage] = useState(true);

  return (
    <span
      className="header-avatar-shell relative grid h-8 w-8 shrink-0 place-items-center rounded-full"
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--theme-accent),transparent,var(--theme-prompt-host),var(--theme-accent))] opacity-90" />
      <span className="absolute inset-[2px] rounded-full bg-black" />
      {hasImage ? (
        <Image
          alt=""
          className="header-avatar-image relative h-[26px] w-[26px] rounded-full border border-white/15 object-cover"
          height={26}
          onError={() => setHasImage(false)}
          src={src}
          width={26}
        />
      ) : (
        <span className="relative grid h-[26px] w-[26px] place-items-center rounded-full border border-white/15 bg-black text-[9px] font-black text-[color:var(--theme-accent)]">
          MK
        </span>
      )}
      <span className="pointer-events-none absolute inset-[3px] rounded-full bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.32)_45%,transparent_58%)] opacity-40" />
    </span>
  );
}
