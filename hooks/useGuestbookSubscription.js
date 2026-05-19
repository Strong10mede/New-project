"use client";

import { useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function useGuestbookSubscription(onMessage) {
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return undefined;
    }

    const channel = supabase
      .channel("guestbook-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guestbook"
        },
        (payload) => {
          const message = payload.new?.message;

          if (typeof message === "string" && message.trim()) {
            handlerRef.current?.(message.trim(), payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
