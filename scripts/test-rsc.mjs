// Invoke server actions the way the browser does: POST to the page path
// with a Next-Action header and a multipart body.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const base = "http://localhost:3000";
const prisma = new PrismaClient();
let failed = 0;
const check = (l, c) => { console.log(`${c ? "ok  " : "FAIL"} ${l}`); if (!c) failed++; };

// sanity: seeded password hash verifies
const u = await prisma.user.findUniqueOrThrow({ where: { email: "aarav@campus.edu" } });
check("bcrypt verifies seeded password", await bcrypt.compare("password123", u.passwordHash));
check("bcrypt rejects wrong password", !(await bcrypt.compare("nope", u.passwordHash)));

// discover the login action id from the page
const html = await (await fetch(`${base}/login`)).text();
const actionId = html.match(/"id":"([a-f0-9]{40,42})"/)?.[1] ?? html.match(/&quot;id&quot;:&quot;([a-f0-9]{40,42})&quot;/)?.[1];
check("found login action id", Boolean(actionId));

// call it: useActionState action receives (prevState, formData)
const fd = new FormData();
fd.set("email", "aarav@campus.edu");
fd.set("password", "password123");
fd.set("$ACTION_1:0", JSON.stringify({ id: actionId, bound: "$@1" }));
fd.set("$ACTION_1:1", JSON.stringify([{ error: null }]));

const res = await fetch(`${base}/login`, {
  method: "POST",
  headers: { "Next-Action": actionId },
  body: fd,
  redirect: "manual",
});
const text = await res.text();
const cookie = (res.headers.get("set-cookie") || "").match(/cc_session=([^;]+)/);
check("login action issues session cookie", Boolean(cookie));
console.log(`   (status ${res.status}; body starts: ${JSON.stringify(text.slice(0, 80))})`);

if (cookie) {
  const c = `cc_session=${cookie[1]}`;

  // RSVP action
  const evPage = await (await fetch(`${base}/events/darkroom-basics`, { headers: { cookie: c } })).text();
  const rsvpId = evPage.match(/"id":"([a-f0-9]{40,42})"/)?.[1];
  const ev = await prisma.event.findUniqueOrThrow({ where: { slug: "darkroom-basics" } });

  const before = await prisma.rsvp.count({ where: { eventId: ev.id, userId: u.id } });
  const rf = new FormData();
  rf.set("1_eventId", ev.id);
  const rsvpRes = await fetch(`${base}/events/darkroom-basics`, {
    method: "POST",
    headers: { "Next-Action": rsvpId, cookie: c },
    body: (() => { const f = new FormData(); f.set("0", JSON.stringify([ev.id, "going"])); return f; })(),
    redirect: "manual",
  });
  console.log(`   rsvp action status ${rsvpRes.status}`);
  const after = await prisma.rsvp.findUnique({ where: { userId_eventId: { userId: u.id, eventId: ev.id } } });
  check("RSVP action created a 'going' row", after?.status === "going");

  // cleanup
  await prisma.rsvp.deleteMany({ where: { userId: u.id, eventId: ev.id } });
  if (before === 0) { /* restored */ }
}

await prisma.$disconnect();
console.log(failed ? `\n${failed} failure(s)` : "\nRSC action checks passed");
process.exit(failed ? 1 : 0);
