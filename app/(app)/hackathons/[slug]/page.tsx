import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatEventWhen, formatDay, formatTime, relativeDay } from "@/lib/format";
import { Avatar } from "@/components/Avatar";
import { CoverImage } from "@/components/CoverImage";
import { HackathonRegisterButton } from "@/components/HackathonRegisterButton";

export default async function HackathonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireUser();
  const { slug } = await params;

  const hackathon = await prisma.hackathon.findUnique({
    where: { slug },
    include: {
      registrations: {
        include: {
          user: { select: { id: true, name: true, avatarColor: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!hackathon) notFound();

  const isRegistered = hackathon.registrations.some(
    (r) => r.user.id === user.id
  );
  const closed = hackathon.registerBy.getTime() < Date.now();

  return (
    <div className="space-y-6">
      <Link
        href="/hackathons"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> All hackathons
      </Link>

      <div className="card overflow-hidden">
        <CoverImage
          src={hackathon.imageUrl}
          alt={hackathon.title}
          className="h-48 w-full sm:h-64"
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
        <div className="p-6">
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

          <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {hackathon.title}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {hackathon.organiser} · {hackathon.theme}
          </p>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Detail icon={CalendarDays} label="When">
              {formatEventWhen(hackathon.startsAt, hackathon.endsAt)}
            </Detail>
            <Detail icon={MapPin} label="Where">
              {hackathon.venue}
            </Detail>
            <Detail icon={Users} label="Team size">
              {hackathon.teamMin === hackathon.teamMax
                ? `${hackathon.teamMin}`
                : `${hackathon.teamMin}–${hackathon.teamMax}`}{" "}
              per team
            </Detail>
            <Detail icon={Clock} label="Registration">
              {closed
                ? "Closed"
                : `Open until ${formatDay(hackathon.registerBy)} ${formatTime(
                    hackathon.registerBy
                  )} (${relativeDay(hackathon.registerBy)})`}
            </Detail>
          </dl>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {hackathon.description}
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <HackathonRegisterButton
              hackathonId={hackathon.id}
              initialRegistered={isRegistered}
              closed={closed}
            />
            {isRegistered ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                You&apos;re on the list. Team-building details go out by email
                before kickoff.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Registered ({hackathon.registrations.length})
        </h2>
        {hackathon.registrations.length ? (
          <ul className="mt-3 flex flex-wrap gap-3">
            {hackathon.registrations.map((r) => (
              <li key={r.id} className="flex items-center gap-2">
                <Avatar name={r.user.name} color={r.user.avatarColor} size={28} />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {r.user.id === user.id ? "You" : r.user.name}
                  {r.teamName ? (
                    <span className="text-slate-400"> · {r.teamName}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No one has registered yet.
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
