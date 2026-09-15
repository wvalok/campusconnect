import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUpcomingEvents } from "@/lib/events";
import { EventCard, EmptyState, PageHeader } from "@/components/cards";

export const metadata = { title: "Events" };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; scope?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  const all = await getUpcomingEvents(user.id);
  const categories = [...new Set(all.map((e) => e.category))].sort();

  const activeCategory = params.category ?? "all";
  const activeScope = params.scope ?? "all";

  let events = all;
  if (activeCategory !== "all") {
    events = events.filter((e) => e.category === activeCategory);
  }
  if (activeScope === "mine") {
    const myClubNames = new Set(
      (
        await prisma.membership.findMany({
          where: { userId: user.id },
          select: { club: { select: { name: true } } },
        })
      ).map((m) => m.club.name)
    );
    events = events.filter((e) => e.clubName && myClubNames.has(e.clubName));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarDays}
        title="Events"
        subtitle="Everything coming up. RSVP to add it to your schedule."
      />

      <div className="flex flex-wrap gap-2">
        <FilterLink
          label="All events"
          href="/events"
          active={activeCategory === "all" && activeScope === "all"}
        />
        <FilterLink
          label="My societies only"
          href="/events?scope=mine"
          active={activeScope === "mine"}
        />
        {categories.map((c) => (
          <FilterLink
            key={c}
            label={c}
            href={`/events?category=${encodeURIComponent(c)}`}
            active={activeCategory === c}
          />
        ))}
      </div>

      {events.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState>No events match this filter.</EmptyState>
      )}
    </div>
  );
}

function FilterLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-brand-600 px-3 py-1.5 text-sm font-medium text-white"
          : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      }
    >
      {label}
    </Link>
  );
}
