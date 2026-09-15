"use client";

import { useState, useTransition } from "react";
import { Check, Plus } from "lucide-react";
import { toggleMembership } from "@/app/actions";

export function JoinButton({
  clubId,
  initialMember,
  size = "md",
}: {
  clubId: string;
  initialMember: boolean;
  size?: "sm" | "md";
}) {
  const [member, setMember] = useState(initialMember);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle() {
    setError(null);
    startTransition(async () => {
      const res = await toggleMembership(clubId);
      if (res.ok) setMember((m) => !m);
      else setError(res.error);
    });
  }

  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={
          member
            ? `btn ${pad} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`
            : `btn ${pad} bg-brand-600 text-white hover:bg-brand-700`
        }
      >
        {pending ? (
          "…"
        ) : member ? (
          <>
            <Check className="h-3.5 w-3.5" /> Joined
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" /> Join
          </>
        )}
      </button>
      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
