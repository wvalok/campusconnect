import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { EventCardData } from "@/components/cards";

type RsvpStatus = "going" | "interested" | "none";

function toStatus(value: string | undefined): RsvpStatus {
  if (value === "going" || value === "interested") return value;
  return "none";
}

function eventArgs(userId: string) {
  return {
    club: { select: { name: true, slug: true } },
    _count: {
      select: { rsvps: { where: { status: "going" } } },
    },
    rsvps: { where: { userId }, select: { status: true } },
  } satisfies Prisma.EventInclude;
}

type EventWithMeta = Prisma.EventGetPayload<{
  include: ReturnType<typeof eventArgs>;
}>;

export function shapeEvent(event: EventWithMeta): EventCardData {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    location: event.location,
    category: event.category,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    capacity: event.capacity,
    imageUrl: event.imageUrl,
    clubName: event.club?.name ?? null,
    goingCount: event._count.rsvps,
    myStatus: toStatus(event.rsvps[0]?.status),
  };
}

export async function getUpcomingEvents(
  userId: string,
  opts: { take?: number; clubId?: string } = {}
): Promise<EventCardData[]> {
  const events = await prisma.event.findMany({
    where: {
      endsAt: { gte: new Date() },
      ...(opts.clubId ? { clubId: opts.clubId } : {}),
    },
    orderBy: { startsAt: "asc" },
    ...(opts.take ? { take: opts.take } : {}),
    include: eventArgs(userId),
  });
  return events.map(shapeEvent);
}

export async function getMyEvents(userId: string): Promise<EventCardData[]> {
  const events = await prisma.event.findMany({
    where: {
      endsAt: { gte: new Date() },
      rsvps: { some: { userId } },
    },
    orderBy: { startsAt: "asc" },
    include: eventArgs(userId),
  });
  return events.map(shapeEvent);
}
