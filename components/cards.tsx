import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Pin,
  Trophy,
  Clock,
} from "lucide-react";
import { formatEventWhen, relativeDay } from "@/lib/format";
import { CoverImage } from "@/components/CoverImage";
import { RsvpControl } from "@/components/RsvpControl";
import { JoinButton } from "@/components/JoinButton";
import { HackathonRegisterButton } from "@/components/HackathonRegisterButton";

type RsvpStatus = "going" | "interested" | "none";

/* ---------- page + section headers ---------- */

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}

export function SectionHeader({
  title,
  href,
  linkLabel = "See all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="card grid place-items-center p-8 text-center text-sm text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

/* ---------- events ---------- */

export type EventCardData = {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number | null;
  clubName: string | null;
  imageUrl: string | null;
  goingCount: number;
  myStatus: RsvpStatus;
};

export function EventCard({ event }: { event: EventCardData }) {
  const full = event.capacity != null && event.goingCount >= event.capacity;

  return (
    <div className="card card-hover flex flex-col overflow-hidden">
      <Link href={`/events/${event.slug}`} className="block">
        <CoverImage src={event.imageUrl} alt={event.title} className="h-36 w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{event.category}</span>
              <span className="truncate text-xs text-slate-400 dark:text-slate-500">
                {event.clubName ?? "Campus"}
              </span>
            </div>
            <h3 className="mt-1.5 font-semibold text-slate-900 dark:text-white">
              <Link
                href={`/events/${event.slug}`}
                className="hover:text-brand-700 dark:hover:text-brand-300"
              >
                {event.title}
              </Link>
            </h3>
          </div>
          <span className="shrink-0 rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            {relativeDay(event.startsAt)}
          </span>
        </div>

        <dl className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <dd>{formatEventWhen(event.startsAt, event.endsAt)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <dd>{event.location}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <dd>
              {event.goingCount} going
              {event.capacity != null ? ` · ${event.capacity} cap` : ""}
            </dd>
          </div>
        </dl>

        <div className="mt-auto pt-1">
          <RsvpControl
            eventId={event.id}
            initialStatus={event.myStatus}
            full={full}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- clubs / societies ---------- */

export type ClubCardData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  kind: string;
  description: string;
  imageUrl: string | null;
  memberCount: number;
  upcomingCount: number;
  isMember: boolean;
};

export function ClubCard({ club }: { club: ClubCardData }) {
  return (
    <div className="card card-hover flex flex-col overflow-hidden">
      <Link href={`/clubs/${club.slug}`} className="block">
        <CoverImage src={club.imageUrl} alt={club.name} className="h-32 w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip capitalize">{club.kind}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {club.category}
            </span>
          </div>
          <h3 className="mt-1.5 font-semibold text-slate-900 dark:text-white">
            <Link
              href={`/clubs/${club.slug}`}
              className="hover:text-brand-700 dark:hover:text-brand-300"
            >
              {club.name}
            </Link>
          </h3>
        </div>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
          {club.description}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {club.memberCount} member{club.memberCount === 1 ? "" : "s"} ·{" "}
          {club.upcomingCount} upcoming
        </p>
        <div className="mt-auto pt-1">
          <JoinButton clubId={club.id} initialMember={club.isMember} size="sm" />
        </div>
      </div>
    </div>
  );
}

/* ---------- announcements ---------- */

export function AnnouncementCard({
  announcement,
}: {
  announcement: {
    id: string;
    title: string;
    body: string;
    pinned: boolean;
    createdAt: Date;
    source: string;
  };
}) {
  return (
    <div className="card card-hover p-4">
      <div className="flex flex-wrap items-center gap-2">
        {announcement.pinned ? (
          <span className="chip bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <Pin className="h-3 w-3" /> Pinned
          </span>
        ) : null}
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {announcement.source}
        </span>
        <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {relativeDay(announcement.createdAt)}
        </span>
      </div>
      <h3 className="mt-1.5 font-semibold text-slate-900 dark:text-white">
        <Link
          href={`/announcements/${announcement.id}`}
          className="hover:text-brand-700 dark:hover:text-brand-300"
        >
          {announcement.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
        {announcement.body}
      </p>
    </div>
  );
}

/* ---------- hackathons ---------- */

export type HackathonCardData = {
  id: string;
  slug: string;
  title: string;
  organiser: string;
  theme: string;
  mode: string;
  venue: string;
  prizePool: string | null;
  startsAt: Date;
  endsAt: Date;
  registerBy: Date;
  imageUrl: string | null;
  teamMin: number;
  teamMax: number;
  registeredCount: number;
  isRegistered: boolean;
};

export function HackathonCard({ hackathon }: { hackathon: HackathonCardData }) {
  const closed = hackathon.registerBy.getTime() < Date.now();

  return (
    <div className="card card-hover flex flex-col overflow-hidden">
      <Link href={`/hackathons/${hackathon.slug}`} className="block">
        <CoverImage
          src={hackathon.imageUrl}
          alt={hackathon.title}
          className="h-40 w-full"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip capitalize">
            <Trophy className="h-3 w-3" /> {hackathon.mode}
          </span>
          {hackathon.prizePool ? (
            <span className="chip bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {hackathon.prizePool}
            </span>
          ) : null}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            <Link
              href={`/hackathons/${hackathon.slug}`}
              className="hover:text-brand-700 dark:hover:text-brand-300"
            >
              {hackathon.title}
            </Link>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {hackathon.organiser} · {hackathon.theme}
          </p>
        </div>
        <dl className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <dd>{formatEventWhen(hackathon.startsAt, hackathon.endsAt)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <dd>{hackathon.venue}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <dd>
              {closed
                ? "Registration closed"
                : `Register by ${relativeDay(hackathon.registerBy)}`}
            </dd>
          </div>
        </dl>
        <div className="mt-auto pt-1">
          <HackathonRegisterButton
            hackathonId={hackathon.id}
            initialRegistered={hackathon.isRegistered}
            closed={closed}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
