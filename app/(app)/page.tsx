import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Library,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUpcomingEvents, getMyEvents } from "@/lib/events";
import { getHackathons } from "@/lib/hackathons";
import {
  EventCard,
  HackathonCard,
  AnnouncementCard,
  SectionHeader,
  EmptyState,
} from "@/components/cards";

export default async function HomePage() {
  const user = await requireUser();

  const [myClubs, upcoming, myEvents, hackathons] = await Promise.all([
    prisma.membership.findMany({
      where: { userId: user.id },
      include: {
        club: {
          select: {
            id: true,
            slug: true,
            name: true,
            kind: true,
            category: true,
            _count: { select: { memberships: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    }),
    getUpcomingEvents(user.id, { take: 4 }),
    getMyEvents(user.id),
    getHackathons(user.id, { upcomingOnly: true, take: 2 }),
  ]);

  const clubIds = myClubs.map((m) => m.clubId);

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { audience: "campus" },
        { clubId: { in: clubIds.length ? clubIds : ["__none__"] } },
      ],
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 4,
    include: { club: { select: { name: true } } },
  });

  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Hi {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here is what is happening around Bennett University.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatTile icon={Users} label="My societies" value={myClubs.length} href="/clubs" />
        <StatTile
          icon={CalendarDays}
          label="Events I'm attending"
          value={myEvents.filter((e) => e.myStatus === "going").length}
          href="/me"
        />
        <StatTile icon={Trophy} label="Upcoming hackathons" value={hackathons.length} href="/hackathons" />
      </section>

      <section>
        <SectionHeader title="Next up for you" href="/me" linkLabel="My schedule" />
        {myEvents.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {myEvents.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState>
            You have not RSVP&apos;d to anything yet.{" "}
            <Link href="/events" className="font-medium text-brand-600 dark:text-brand-400">
              Browse events
            </Link>
          </EmptyState>
        )}
      </section>

      <section>
        <SectionHeader title="Upcoming events" href="/events" />
        <div className="grid gap-4 sm:grid-cols-2">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {hackathons.length ? (
        <section>
          <SectionHeader title="Hackathons" href="/hackathons" />
          <div className="grid gap-4 sm:grid-cols-2">
            {hackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeader title="Announcements" href="/announcements" />
        <div className="space-y-3">
          {announcements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={{
                id: a.id,
                title: a.title,
                body: a.body,
                pinned: a.pinned,
                createdAt: a.createdAt,
                source: a.club ? a.club.name : "Campus-wide",
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Campus" href="/campus" linkLabel="Open campus guide" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CampusLink icon={Building2} label="Hostel" href="/campus/hostel" />
          <CampusLink icon={BookOpen} label="Library" href="/campus/library" />
          <CampusLink icon={Library} label="LRC access" href="/campus/lrc" />
          <CampusLink icon={MapPin} label="Campus map" href="/campus/map" />
        </div>
      </section>

      <section>
        <SectionHeader title="My societies" href="/clubs" linkLabel="Discover more" />
        {myClubs.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {myClubs.map((m) => (
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
                    {m.club.category} · {m.club._count.memberships} member
                    {m.club._count.memberships === 1 ? "" : "s"}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-brand-500" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState>
            You have not joined any societies yet.{" "}
            <Link href="/clubs" className="font-medium text-brand-600 dark:text-brand-400">
              Find one
            </Link>
          </EmptyState>
        )}
      </section>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="card card-hover flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </Link>
  );
}

function CampusLink({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card card-hover flex items-center gap-3 p-4 text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      <Icon className="h-5 w-5 text-brand-500" />
      {label}
    </Link>
  );
}
