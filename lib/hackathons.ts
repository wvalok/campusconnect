import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { HackathonCardData } from "@/components/cards";

function hackathonArgs(userId: string) {
  return {
    _count: { select: { registrations: true } },
    registrations: { where: { userId }, select: { id: true } },
  } satisfies Prisma.HackathonInclude;
}

type HackathonWithMeta = Prisma.HackathonGetPayload<{
  include: ReturnType<typeof hackathonArgs>;
}>;

export function shapeHackathon(h: HackathonWithMeta): HackathonCardData {
  return {
    id: h.id,
    slug: h.slug,
    title: h.title,
    organiser: h.organiser,
    theme: h.theme,
    mode: h.mode,
    venue: h.venue,
    prizePool: h.prizePool,
    startsAt: h.startsAt,
    endsAt: h.endsAt,
    registerBy: h.registerBy,
    imageUrl: h.imageUrl,
    teamMin: h.teamMin,
    teamMax: h.teamMax,
    registeredCount: h._count.registrations,
    isRegistered: h.registrations.length > 0,
  };
}

export async function getHackathons(
  userId: string,
  opts: { take?: number; upcomingOnly?: boolean } = {}
): Promise<HackathonCardData[]> {
  const rows = await prisma.hackathon.findMany({
    where: opts.upcomingOnly ? { endsAt: { gte: new Date() } } : {},
    orderBy: { startsAt: "asc" },
    ...(opts.take ? { take: opts.take } : {}),
    include: hackathonArgs(userId),
  });
  return rows.map(shapeHackathon);
}

export async function getMyHackathons(
  userId: string
): Promise<HackathonCardData[]> {
  const rows = await prisma.hackathon.findMany({
    where: { registrations: { some: { userId } } },
    orderBy: { startsAt: "asc" },
    include: hackathonArgs(userId),
  });
  return rows.map(shapeHackathon);
}
