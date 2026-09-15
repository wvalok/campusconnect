import { Users } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ClubCard, type ClubCardData, PageHeader } from "@/components/cards";

export const metadata = { title: "Societies & Clubs" };

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const user = await requireUser();
  const { kind } = await searchParams;
  const filter = kind === "society" || kind === "club" ? kind : "all";

  const clubs = await prisma.club.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { memberships: true } },
      memberships: { where: { userId: user.id }, select: { id: true } },
      events: { where: { endsAt: { gte: new Date() } }, select: { id: true } },
    },
  });

  const shaped: ClubCardData[] = clubs.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    category: c.category,
    kind: c.kind,
    description: c.description,
    imageUrl: c.imageUrl,
    memberCount: c._count.memberships,
    upcomingCount: c.events.length,
    isMember: c.memberships.length > 0,
  }));

  const mine = shaped.filter((c) => c.isMember);
  const societies = shaped.filter((c) => c.kind === "society");
  const justClubs = shaped.filter((c) => c.kind === "club");

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Users}
        title="Societies & Clubs"
        subtitle="Join a group to see its announcements and events on your home page."
      />

      <div className="flex flex-wrap gap-2">
        <Tab label="All" href="/clubs" active={filter === "all"} />
        <Tab label="Societies" href="/clubs?kind=society" active={filter === "society"} />
        <Tab label="Clubs" href="/clubs?kind=club" active={filter === "club"} />
      </div>

      {mine.length && filter === "all" ? (
        <Group title="My groups" items={mine} />
      ) : null}

      {(filter === "all" || filter === "society") && societies.length ? (
        <Group title="Societies" items={societies} />
      ) : null}

      {(filter === "all" || filter === "club") && justClubs.length ? (
        <Group title="Clubs" items={justClubs} />
      ) : null}
    </div>
  );
}

function Group({ title, items }: { title: string; items: ClubCardData[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </section>
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
