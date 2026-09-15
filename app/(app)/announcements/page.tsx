import Link from "next/link";
import { Megaphone } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AnnouncementCard, EmptyState, PageHeader } from "@/components/cards";

export const metadata = { title: "Announcements" };

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const user = await requireUser();
  const { filter } = await searchParams;
  const scope = filter === "campus" || filter === "clubs" ? filter : "all";

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    select: { clubId: true },
  });
  const clubIds = memberships.map((m) => m.clubId);
  const safeClubIds = clubIds.length ? clubIds : ["__none__"];

  const where =
    scope === "campus"
      ? { audience: "campus" }
      : scope === "clubs"
        ? { clubId: { in: safeClubIds } }
        : {
            OR: [{ audience: "campus" }, { clubId: { in: safeClubIds } }],
          };

  const announcements = await prisma.announcement.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: { club: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Megaphone}
        title="Announcements"
        subtitle="Campus-wide notices plus updates from societies you have joined."
      />

      <div className="flex flex-wrap gap-2">
        <Tab label="All" href="/announcements" active={scope === "all"} />
        <Tab
          label="Campus-wide"
          href="/announcements?filter=campus"
          active={scope === "campus"}
        />
        <Tab
          label="My societies"
          href="/announcements?filter=clubs"
          active={scope === "clubs"}
        />
      </div>

      {announcements.length ? (
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
      ) : (
        <EmptyState>
          Nothing here yet. Join a society to see its announcements.
        </EmptyState>
      )}
    </div>
  );
}

function Tab({
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
