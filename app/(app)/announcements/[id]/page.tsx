import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pin } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDay, formatTime } from "@/lib/format";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: { club: { select: { name: true, slug: true } } },
  });

  if (!announcement) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/announcements"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> All announcements
      </Link>

      <article className="card p-6">
        <div className="flex flex-wrap items-center gap-2">
          {announcement.pinned ? (
            <span className="chip bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <Pin className="h-3 w-3" /> Pinned
            </span>
          ) : null}
          {announcement.club ? (
            <Link
              href={`/clubs/${announcement.club.slug}`}
              className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              {announcement.club.name}
            </Link>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Campus-wide
            </span>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          {announcement.title}
        </h1>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {formatDay(announcement.createdAt)} at{" "}
          {formatTime(announcement.createdAt)}
        </p>

        <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {announcement.body}
        </p>
      </article>
    </div>
  );
}
