import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUpcomingEvents } from "@/lib/events";
import { Avatar } from "@/components/Avatar";
import { CoverImage } from "@/components/CoverImage";
import { JoinButton } from "@/components/JoinButton";
import { EventCard, AnnouncementCard, EmptyState } from "@/components/cards";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireUser();
  const { slug } = await params;

  const club = await prisma.club.findUnique({
    where: { slug },
    include: {
      memberships: {
        include: {
          user: { select: { id: true, name: true, avatarColor: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
      announcements: {
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: 5,
      },
    },
  });

  if (!club) notFound();

  const isMember = club.memberships.some((m) => m.user.id === user.id);
  const events = await getUpcomingEvents(user.id, { clubId: club.id });

  return (
    <div className="space-y-6">
      <Link
        href="/clubs"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> Societies &amp; Clubs
      </Link>

      <div className="card overflow-hidden">
        <CoverImage
          src={club.imageUrl}
          alt={club.name}
          className="h-40 w-full sm:h-56"
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip capitalize">{club.kind}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {club.category}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {club.name}
          </h1>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {club.memberships.length} member
              {club.memberships.length === 1 ? "" : "s"}
            </span>
            {club.meets ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {club.meets}
              </span>
            ) : null}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {club.description}
          </p>
          <div className="mt-5">
            <JoinButton clubId={club.id} initialMember={isMember} />
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          Upcoming events
        </h2>
        {events.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState>No upcoming events from this group.</EmptyState>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          Announcements
        </h2>
        {club.announcements.length ? (
          <div className="space-y-3">
            {club.announcements.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={{
                  id: a.id,
                  title: a.title,
                  body: a.body,
                  pinned: a.pinned,
                  createdAt: a.createdAt,
                  source: club.name,
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState>Nothing posted yet.</EmptyState>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Members
        </h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {club.memberships.map((m) => (
            <li key={m.id} className="flex items-center gap-2">
              <Avatar name={m.user.name} color={m.user.avatarColor} size={28} />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {m.user.id === user.id ? "You" : m.user.name}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
