import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMyEvents } from "@/lib/events";
import { getMyHackathons } from "@/lib/hackathons";
import { Avatar } from "@/components/Avatar";
import {
  EventCard,
  HackathonCard,
  EmptyState,
  PageHeader,
} from "@/components/cards";
import { logout } from "@/app/login/actions";

export const metadata = { title: "My profile" };

export default async function ProfilePage() {
  const user = await requireUser();

  const [events, hackathons, memberships, pastCount] = await Promise.all([
    getMyEvents(user.id),
    getMyHackathons(user.id),
    prisma.membership.findMany({
      where: { userId: user.id },
      include: {
        club: { select: { slug: true, name: true, kind: true, category: true } },
      },
      orderBy: { joinedAt: "desc" },
    }),
    prisma.rsvp.count({
      where: { userId: user.id, event: { endsAt: { lt: new Date() } } },
    }),
  ]);

  const going = events.filter((e) => e.myStatus === "going");
  const interested = events.filter((e) => e.myStatus === "interested");

  return (
    <div className="space-y-8">
      <PageHeader icon={UserRound} title="My profile" />

      <div className="card flex flex-wrap items-center gap-4 p-6">
        <Avatar name={user.name} color={user.avatarColor} size={56} />
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            {[user.major, user.gradYear ? `Class of ${user.gradYear}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <form action={logout} className="ml-auto">
          <button type="submit" className="btn-secondary">
            Sign out
          </button>
        </form>
      </div>

      <section className="grid gap-3 sm:grid-cols-4">
        <Stat label="Societies" value={memberships.length} />
        <Stat label="Upcoming RSVPs" value={events.length} />
        <Stat label="Hackathons" value={hackathons.length} />
        <Stat label="Events attended" value={pastCount} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          Going ({going.length})
        </h2>
        {going.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {going.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState>
            Nothing yet.{" "}
            <Link href="/events" className="font-medium text-brand-600 dark:text-brand-400">
              Find something to do
            </Link>
          </EmptyState>
        )}
      </section>

      {interested.length ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            Interested ({interested.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {interested.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      {hackathons.length ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            My hackathons ({hackathons.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {hackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          My societies ({memberships.length})
        </h2>
        {memberships.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {memberships.map((m) => (
              <Link
                key={m.id}
                href={`/clubs/${m.club.slug}`}
                className="card card-hover flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {m.club.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    <span className="capitalize">{m.club.kind}</span> ·{" "}
                    {m.club.category}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-500" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState>
            You have not joined any societies.{" "}
            <Link href="/clubs" className="font-medium text-brand-600 dark:text-brand-400">
              Browse them
            </Link>
          </EmptyState>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
