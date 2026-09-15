"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function setRsvp(
  eventId: string,
  status: "going" | "interested" | "none"
): Promise<ActionResult> {
  const user = await requireUser();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { rsvps: { where: { status: "going" } } } } },
  });
  if (!event) return { ok: false, error: "Event not found." };

  if (status === "none") {
    await prisma.rsvp.deleteMany({ where: { userId: user.id, eventId } });
  } else {
    const existing = await prisma.rsvp.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });

    if (
      status === "going" &&
      event.capacity != null &&
      existing?.status !== "going" &&
      event._count.rsvps >= event.capacity
    ) {
      return { ok: false, error: "This event is at capacity." };
    }

    await prisma.rsvp.upsert({
      where: { userId_eventId: { userId: user.id, eventId } },
      create: { userId: user.id, eventId, status },
      update: { status },
    });
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/me");
  revalidatePath(`/events/${event.slug}`);
  return { ok: true };
}

export async function toggleMembership(clubId: string): Promise<ActionResult> {
  const user = await requireUser();

  const club = await prisma.club.findUnique({ where: { id: clubId } });
  if (!club) return { ok: false, error: "Club not found." };

  const existing = await prisma.membership.findUnique({
    where: { userId_clubId: { userId: user.id, clubId } },
  });

  if (existing) {
    await prisma.membership.delete({ where: { id: existing.id } });
  } else {
    await prisma.membership.create({
      data: { userId: user.id, clubId, role: "member" },
    });
  }

  revalidatePath("/");
  revalidatePath("/clubs");
  revalidatePath("/announcements");
  revalidatePath("/me");
  revalidatePath(`/clubs/${club.slug}`);
  return { ok: true };
}

export async function setHackathonRegistration(
  hackathonId: string,
  register: boolean
): Promise<ActionResult> {
  const user = await requireUser();

  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
  });
  if (!hackathon) return { ok: false, error: "Hackathon not found." };

  if (register) {
    if (hackathon.registerBy.getTime() < Date.now()) {
      return { ok: false, error: "Registration has closed." };
    }
    await prisma.hackathonRegistration.upsert({
      where: { userId_hackathonId: { userId: user.id, hackathonId } },
      create: { userId: user.id, hackathonId },
      update: {},
    });
  } else {
    await prisma.hackathonRegistration.deleteMany({
      where: { userId: user.id, hackathonId },
    });
  }

  revalidatePath("/");
  revalidatePath("/hackathons");
  revalidatePath("/me");
  revalidatePath(`/hackathons/${hackathon.slug}`);
  return { ok: true };
}
