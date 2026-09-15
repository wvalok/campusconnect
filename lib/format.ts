const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDay(date: Date): string {
  return dateFmt.format(date);
}

export function formatTime(date: Date): string {
  return timeFmt.format(date);
}

export function formatEventWhen(startsAt: Date, endsAt: Date): string {
  const sameDay = startsAt.toDateString() === endsAt.toDateString();
  if (sameDay) {
    return `${dateFmt.format(startsAt)} · ${timeFmt.format(startsAt)}–${timeFmt.format(endsAt)}`;
  }
  return `${dateFmt.format(startsAt)} ${timeFmt.format(startsAt)} → ${dateFmt.format(endsAt)} ${timeFmt.format(endsAt)}`;
}

export function relativeDay(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / 86400000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  return dateFmt.format(date);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
