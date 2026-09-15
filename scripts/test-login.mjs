// End-to-end test of the login server action over HTTP (progressive-enhancement path).
const base = "http://localhost:3000";

const page = await fetch(`${base}/login`);
const html = await page.text();

const decode = (s) => s.replace(/&quot;/g, '"');
const grab = (name) => {
  const m = html.match(
    new RegExp(`name="${name.replace(/[$:]/g, "\\$&")}"[^>]*value="([^"]*)"`)
  );
  return m ? decode(m[1]) : null;
};

const form = new URLSearchParams();
form.set("$ACTION_1:0", grab("\\$ACTION_1:0"));
form.set("$ACTION_1:1", grab("\\$ACTION_1:1"));
const key = grab("\\$ACTION_KEY");
if (key) form.set("$ACTION_KEY", key);
form.set("email", "aarav@campus.edu");
form.set("password", "password123");

const res = await fetch(`${base}/login`, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: form.toString(),
  redirect: "manual",
});

const setCookie = res.headers.get("set-cookie") || "";
const cookieMatch = setCookie.match(/cc_session=([^;]+)/);
console.log(`login POST -> ${res.status}, location=${res.headers.get("location")}`);
console.log(`session cookie set: ${Boolean(cookieMatch)}`);

let failed = 0;
if (![303, 302, 307].includes(res.status)) failed++;
if (!cookieMatch) failed++;

if (cookieMatch) {
  const home = await fetch(`${base}/`, {
    headers: { cookie: `cc_session=${cookieMatch[1]}` },
    redirect: "manual",
  });
  const body = await home.text();
  const greeted = body.includes("Hi Aarav");
  console.log(`GET / with session -> ${home.status}, greets Aarav: ${greeted}`);
  if (home.status !== 200 || !greeted) failed++;
}

// wrong password
const bad = new URLSearchParams(form);
bad.set("password", "wrong");
const badRes = await fetch(`${base}/login`, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: bad.toString(),
  redirect: "manual",
});
const badBody = await badRes.text();
const rejected =
  !badRes.headers.get("set-cookie")?.includes("cc_session=ey");
console.log(`bad password -> ${badRes.status}, no valid session issued: ${rejected}`);
if (!rejected) failed++;

console.log(failed ? `\n${failed} failure(s)` : "\nLogin flow OK");
process.exit(failed ? 1 : 0);
