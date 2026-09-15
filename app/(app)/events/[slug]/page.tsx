import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatEventWhen, relativeDay } from "@/lib/format";
import { Avatar } from "@/components/Avatar";
import { CoverImage } from "@/components/CoverImage";
import { RsvpControl } from "@/components/RsvpControl";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireUser();
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      club: { select: { name: true, slug: true } },
      rsvps: {
        where: { status: "going" },
        include: {
          user: { select: { id: true, name: true, avatarColor: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) notFound();

  const goingCount = event.rsvps.length;
  const myRsvp = await prisma.rsvp.findUnique({
    where: { userId_eventId: { userId: user.id, eventId: event.id } },
  });
  const myStatus =
    myRsvp?.status === "going" || myRsvp?.status === "interested"
      ? myRsvp.status
      : "none";
  const full = event.capacity != null && goingCount >= event.capacity;

  return (
    <div className="space-y-6">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>

      <div className="card overflow-hidden">
        <CoverImage
          src={event.imageUrl}
          alt={event.title}
          className="h-48 w-full sm:h-64"
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">{event.category}</span>
            {event.club ? (
              <Link
                href={`/clubs/${event.club.slug}`}
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                {event.club.name}
              </Link>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Campus-wide
              </span>
            )}
            <span className="ml-auto rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              {relativeDay(event.startsAt)}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {event.title}
          </h1>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Detail icon={CalendarDays} label="When">
              {formatEventWhen(event.startsAt, event.endsAt)}
            </Detail>
            <Detail icon={MapPin} label="Where">
              {event.location}
            </Detail>
            <Detail icon={Users} label="Attendance">
              {goingCount} going
              {event.capacity != null ? ` · ${event.capacity} capacity` : ""}
            </Detail>
          </dl>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {event.description}
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Your response
            </p>
            <RsvpControl
              eventId={event.id}
              initialStatus={myStatus}
              full={full}
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Who&apos;s going ({goingCount})
        </h2>
        {goingCount ? (
          <ul className="mt-3 flex flex-wrap gap-3">
            {event.rsvps.map((r) => (
              <li key={r.id} className="flex items-center gap-2">
                <Avatar name={r.user.name} color={r.user.avatarColor} size={28} />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {r.user.id === user.id ? "You" : r.user.name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No one has RSVP&apos;d yet. Be the first.
          </p>
        )}
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>
        <dt className="text-slate-400 dark:text-slate-500">{label}</dt>
        <dd className="font-medium text-slate-700 dark:text-slate-200">
          {children}
        </dd>
      </div>
    </div>
  );
}
