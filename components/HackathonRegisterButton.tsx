"use client";

import { useState, useTransition } from "react";
import { Check, Trophy } from "lucide-react";
import { setHackathonRegistration } from "@/app/actions";

export function HackathonRegisterButton({
  hackathonId,
  initialRegistered,
  closed,
  size = "md",
}: {
  hackathonId: string;
  initialRegistered: boolean;
  closed: boolean;
  size?: "sm" | "md";
}) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle() {
    setError(null);
    startTransition(async () => {
      const res = await setHackathonRegistration(hackathonId, !registered);
      if (res.ok) setRegistered((r) => !r);
      else setError(res.error);
    });
  }

  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm";

  if (closed && !registered) {
    return (
      <span className={`chip ${size === "sm" ? "" : "text-sm"}`}>
        Registration closed
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={
          registered
            ? `btn ${pad} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`
            : `btn ${pad} bg-brand-600 text-white hover:bg-brand-700`
        }
      >
        {pending ? (
          "…"
        ) : registered ? (
          <>
            <Check className="h-3.5 w-3.5" /> Registered
          </>
        ) : (
          <>
            <Trophy className="h-3.5 w-3.5" /> Register
          </>
        )}
      </button>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
