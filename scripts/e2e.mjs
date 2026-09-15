import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";

const base = "http://localhost:3000";
const prisma = new PrismaClient();
let failed = 0;
const check = (l, c) => {
  console.log(`${c ? "ok  " : "FAIL"} ${l}`);
  if (!c) failed++;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// --- login ---
await page.goto(`${base}/`);
check("unauthenticated visit lands on /login", page.url().endsWith("/login"));
await page.fill('input[name="email"]', "aarav@campus.edu");
await page.fill('input[name="password"]', "password123");
await page.click('button[type="submit"]');
await page.waitForURL(`${base}/`);
check("login redirects to home", page.url() === `${base}/`);
check("home greets the user", await page.getByText("Hi Aarav").isVisible());
check(
  "Bennett logo shows in the header",
  await page.getByRole("img", { name: "Bennett University" }).first().isVisible()
);

await page.screenshot({ path: "scripts/screens/01-home-light.png", fullPage: true });

// --- dark mode ---
await page.getByTestId("theme-toggle").click();
await page.waitForTimeout(400);
check(
  "toggling switches the html element to dark",
  await page.evaluate(() => document.documentElement.classList.contains("dark"))
);
await page.screenshot({ path: "scripts/screens/02-home-dark.png", fullPage: true });
// stay in dark for the rest — it should persist across navigation
await page.reload();
await page.waitForTimeout(300);
check(
  "dark mode persists after reload",
  await page.evaluate(() => document.documentElement.classList.contains("dark"))
);

// --- events + RSVP ---
await prisma.rsvp.deleteMany({
  where: {
    user: { email: "aarav@campus.edu" },
    event: { slug: "contemporary-dance-workshop" },
  },
});
await page.goto(`${base}/events/contemporary-dance-workshop`);
await page.getByRole("button", { name: /^Going$/ }).first().click();
await page.getByRole("button", { name: "Going" }).first().waitFor();
await page.waitForTimeout(700);
const rsvp = await prisma.rsvp.findFirst({
  where: {
    user: { email: "aarav@campus.edu" },
    event: { slug: "contemporary-dance-workshop" },
  },
});
check("clicking Going creates a 'going' RSVP", rsvp?.status === "going");
await page.screenshot({ path: "scripts/screens/03-event-dark.png", fullPage: true });

// --- societies + join ---
await prisma.membership.deleteMany({
  where: { user: { email: "aarav@campus.edu" }, club: { slug: "debate-union" } },
});
await page.goto(`${base}/clubs/debate-union`);
await page.getByRole("button", { name: "Join" }).first().click();
await page.getByRole("button", { name: "Joined" }).first().waitFor();
await page.waitForTimeout(700);
const membership = await prisma.membership.findFirst({
  where: { user: { email: "aarav@campus.edu" }, club: { slug: "debate-union" } },
});
check("clicking Join creates a membership", Boolean(membership));

// --- hackathons + register ---
await prisma.hackathonRegistration.deleteMany({
  where: {
    user: { email: "aarav@campus.edu" },
    hackathon: { slug: "robosprint" },
  },
});
await page.goto(`${base}/hackathons/robosprint`);
await page.getByRole("button", { name: "Register" }).first().click();
await page.getByRole("button", { name: "Registered" }).first().waitFor();
await page.waitForTimeout(700);
const reg = await prisma.hackathonRegistration.findFirst({
  where: {
    user: { email: "aarav@campus.edu" },
    hackathon: { slug: "robosprint" },
  },
});
check("clicking Register creates a hackathon registration", Boolean(reg));
await page.goto(`${base}/hackathons`);
await page.screenshot({ path: "scripts/screens/04-hackathons-dark.png", fullPage: true });

// --- campus pages ---
await page.goto(`${base}/campus`);
check("campus hub loads", await page.getByText("Campus guide").first().isVisible());
for (const [path, text] of [
  ["/campus/hostel", "Mess timings"],
  ["/campus/library", "Online databases"],
  ["/campus/lrc", "Floor guide"],
  ["/campus/map", "Key locations"],
]) {
  await page.goto(base + path);
  check(`${path} renders`, await page.getByText(text).first().isVisible());
}
check(
  "campus map embeds an OpenStreetMap iframe",
  (await page.locator('iframe[src*="openstreetmap.org"]').count()) === 1
);
await page.screenshot({ path: "scripts/screens/05-campus-map-dark.png", fullPage: true });

// --- back to light for a clean light screenshot of a resource page ---
await page.goto(`${base}/campus/lrc`);
await page.getByTestId("theme-toggle").click();
await page.waitForTimeout(400);
check(
  "toggling back removes the dark class",
  !(await page.evaluate(() => document.documentElement.classList.contains("dark")))
);
await page.screenshot({ path: "scripts/screens/06-lrc-light.png", fullPage: true });

// --- profile ---
await page.goto(`${base}/me`);
check(
  "profile lists the joined society",
  await page.getByText("Debate Union").first().isVisible()
);
check(
  "profile shows a My hackathons section",
  await page.getByText(/My hackathons/).isVisible()
);

await browser.close();
await prisma.$disconnect();
console.log(failed ? `\n${failed} failure(s)` : "\nAll e2e checks passed");
process.exit(failed ? 1 : 0);
