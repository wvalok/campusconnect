import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const base = "http://localhost:3000";

const user = await prisma.user.findUnique({
  where: { email: "aarav@campus.edu" },
});
await prisma.$disconnect();

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
const token = await new SignJWT({ userId: user.id })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("7d")
  .sign(secret);

const cookie = `cc_session=${token}`;

const clubSlug = "coding-society";
const eventSlug = "hack-night-october";
const ann = await (async () => {
  const p = new PrismaClient();
  const a = await p.announcement.findFirst();
  await p.$disconnect();
  return a.id;
})();

const paths = [
  "/",
  "/events",
  "/events?scope=mine",
  "/events?category=Workshop",
  `/events/${eventSlug}`,
  "/clubs",
  `/clubs/${clubSlug}`,
  "/announcements",
  "/announcements?filter=clubs",
  `/announcements/${ann}`,
  "/me",
  "/login",
];

let failures = 0;
for (const path of paths) {
  const res = await fetch(base + path, {
    headers: { cookie },
    redirect: "manual",
  });
  const ok = res.status === 200 || (path === "/login" && res.status === 307);
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"} ${res.status}  ${path}`);
}

// Unauthenticated request should redirect
const noAuth = await fetch(base + "/", { redirect: "manual" });
console.log(
  `${noAuth.status === 307 ? "ok  " : "FAIL"} ${noAuth.status}  / (no cookie, expect 307 -> ${noAuth.headers.get("location")})`
);
if (noAuth.status !== 307) failures++;

console.log(failures ? `\n${failures} failure(s)` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
