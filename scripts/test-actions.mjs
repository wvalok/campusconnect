// Exercises the same Prisma operations the server actions perform,
// to validate RSVP capacity handling and membership toggling.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let failed = 0;
const check = (label, cond) => {
  console.log(`${cond ? "ok  " : "FAIL"} ${label}`);
  if (!cond) failed++;
};

const user = await prisma.user.findUniqueOrThrow({
  where: { email: "meera@campus.edu" },
});
const club = await prisma.club.findUniqueOrThrow({
  where: { slug: "coding-society" },
});

// --- membership toggle ---
await prisma.membership.deleteMany({ where: { userId: user.id, clubId: club.id } });
let m = await prisma.membership.findUnique({
  where: { userId_clubId: { userId: user.id, clubId: club.id } },
});
check("starts as non-member", m === null);

await prisma.membership.create({ data: { userId: user.id, clubId: club.id } });
m = await prisma.membership.findUnique({
  where: { userId_clubId: { userId: user.id, clubId: club.id } },
});
check("join creates membership", m !== null);

await prisma.membership.delete({ where: { id: m.id } });
m = await prisma.membership.findUnique({
  where: { userId_clubId: { userId: user.id, clubId: club.id } },
});
check("leave removes membership", m === null);

// --- RSVP capacity ---
const cap = 2;
const ev = await prisma.event.create({
  data: {
    slug: `capacity-test-${Date.now()}`,
    title: "Capacity Test",
    description: "x",
    location: "x",
    category: "Test",
    startsAt: new Date(Date.now() + 86400000),
    endsAt: new Date(Date.now() + 90000000),
    capacity: cap,
  },
});
const others = await prisma.user.findMany({ where: { NOT: { id: user.id } }, take: cap });
for (const o of others) {
  await prisma.rsvp.create({ data: { userId: o.id, eventId: ev.id, status: "going" } });
}
const goingCount = await prisma.rsvp.count({
  where: { eventId: ev.id, status: "going" },
});
check("event filled to capacity", goingCount === cap);

// mirror the action's capacity guard
const existing = await prisma.rsvp.findUnique({
  where: { userId_eventId: { userId: user.id, eventId: ev.id } },
});
const wouldBlock =
  ev.capacity != null && existing?.status !== "going" && goingCount >= ev.capacity;
check("further 'going' RSVP is blocked at capacity", wouldBlock === true);

// 'interested' still allowed
await prisma.rsvp.upsert({
  where: { userId_eventId: { userId: user.id, eventId: ev.id } },
  create: { userId: user.id, eventId: ev.id, status: "interested" },
  update: { status: "interested" },
});
const mine = await prisma.rsvp.findUnique({
  where: { userId_eventId: { userId: user.id, eventId: ev.id } },
});
check("'interested' RSVP allowed when 'going' is full", mine?.status === "interested");

// cleanup
await prisma.rsvp.deleteMany({ where: { eventId: ev.id } });
await prisma.event.delete({ where: { id: ev.id } });

await prisma.$disconnect();
console.log(failed ? `\n${failed} failure(s)` : "\nAll action-logic checks passed");
process.exit(failed ? 1 : 0);
