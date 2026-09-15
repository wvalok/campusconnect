"use client";

import { useState, useTransition } from "react";
import { Check, Star } from "lucide-react";
import { setRsvp } from "@/app/actions";

type Status = "going" | "interested" | "none";

export function RsvpControl({
  eventId,
  initialStatus,
  full,
  size = "md",
}: {
  eventId: string;
  initialStatus: Status;
  full: boolean;
  size?: "sm" | "md";
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function choose(next: Status) {
    const target = status === next ? "none" : next;
    setError(null);
    startTransition(async () => {
      const res = await setRsvp(eventId, target);
      if (res.ok) setStatus(target);
      else setError(res.error);
    });
  }

  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  const goingDisabled = full && status !== "going";
  const base =
    "btn " +
    pad +
    " border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("going")}
          disabled={pending || goingDisabled}
          className={
            status === "going"
              ? `btn ${pad} bg-brand-600 text-white hover:bg-brand-700`
              : base
          }
        >
          {status === "going" ? (
            <>
              <Check className="h-3.5 w-3.5" /> Going
            </>
          ) : goingDisabled ? (
            "Full"
          ) : (
            "Going"
          )}
        </button>
        <button
          type="button"
          onClick={() => choose("interested")}
          disabled={pending}
          className={
            status === "interested"
              ? `btn ${pad} bg-amber-500 text-white hover:bg-amber-600`
              : base
          }
        >
          {status === "interested" ? (
            <>
              <Check className="h-3.5 w-3.5" /> Interested
            </>
          ) : (
            <>
              <Star className="h-3.5 w-3.5" /> Interested
            </>
          )}
        </button>
      </div>
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
