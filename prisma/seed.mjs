import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function days(n, hour = 18, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, minutes, 0, 0);
  return d;
}
const hoursLater = (date, h) => new Date(date.getTime() + h * 3600 * 1000);
const img = (name) => `/img/${name}.jpg`;

async function main() {
  console.log("Clearing existing data...");
  await prisma.hackathonRegistration.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating students...");
  const passwordHash = await bcrypt.hash("password123", 10);
  const students = await Promise.all(
    [
      { name: "Aarav Sharma", email: "aarav@campus.edu", major: "Computer Science", gradYear: 2027, avatarColor: "#3563eb" },
      { name: "Diya Patel", email: "diya@campus.edu", major: "Design", gradYear: 2026, avatarColor: "#db2777" },
      { name: "Kabir Nair", email: "kabir@campus.edu", major: "Mechanical Engineering", gradYear: 2028, avatarColor: "#16a34a" },
      { name: "Meera Iyer", email: "meera@campus.edu", major: "Economics", gradYear: 2027, avatarColor: "#d97706" },
    ].map((s) => prisma.user.create({ data: { ...s, passwordHash } }))
  );
  const demo = students[0];

  console.log("Creating clubs and societies...");
  const clubData = [
    { slug: "bennett-coders", name: "Bennett Coders", kind: "club", category: "Technology", image: "coding", meets: "Wednesdays, 6 pm · N Block Lab 204", description: "Weekly hack nights, competitive programming ladders, and open-source project sprints. Every skill level is welcome, from first `print()` to first pull request." },
    { slug: "robotics-club", name: "Robotics Club", kind: "club", category: "Technology", image: "robotics", meets: "Saturdays, 3 pm · Mechanical Workshop", description: "Design, build, and drive robots for line-follower, combat, and autonomous-navigation competitions. Shared tools, 3D printers, and a parts library." },
    { slug: "e-cell", name: "Entrepreneurship Cell (E-Cell)", kind: "club", category: "Business", image: "startup", meets: "Fortnightly, Fridays 5 pm · Business School", description: "Founder fireside chats, lean-canvas workshops, and the campus pitch competition. Runs the student incubator office hours." },
    { slug: "quiz-club", name: "Quiz Club", kind: "club", category: "Academic", image: "quiz", meets: "Thursdays, 5 pm · Humanities Hall 12", description: "General, sports, and pop-culture quizzing with weekly practice rounds and inter-college circuit trips." },
    { slug: "trekking-club", name: "Trekking & Adventure Club", kind: "club", category: "Outdoors", image: "trekking", meets: "Trip briefings, Fridays 6 pm · Club Room", description: "Weekend treks, camping trips, and gear-sharing for the hills near campus. Mandatory kit check before every trip." },
    { slug: "esports-club", name: "Esports Club", kind: "club", category: "Sports", image: "esports", meets: "Daily scrims, 8 pm · Gaming Room", description: "Valorant, BGMI, FIFA, and chess ladders, plus the campus teams for the inter-university circuit." },
    { slug: "literary-society", name: "The Literary Society", kind: "society", category: "Arts", image: "literary", meets: "Tuesdays, 5 pm · LRC Discussion Commons", description: "Open mics, a termly zine, book circles, and creative-writing critique sessions." },
    { slug: "debate-union", name: "Debate Union", kind: "society", category: "Academic", image: "debate", meets: "Mondays & Thursdays, 6 pm · Humanities Hall", description: "British Parliamentary debating, weekly practice rounds, adjudication training, and inter-college tournaments." },
    { slug: "music-collective", name: "Music Collective", kind: "society", category: "Arts", image: "music", meets: "Open jam, Sundays 4 pm · Practice Rooms", description: "Jam sessions, open mics, and the student band programme. Practice rooms and a small backline open to members." },
    { slug: "photography-society", name: "Photography Society", kind: "society", category: "Arts", image: "photography", meets: "Photo walks, alternate Saturdays 5 pm", description: "Photo walks, darkroom sessions, and monthly themed challenges. Cameras and lenses available to borrow." },
    { slug: "dance-society", name: "Dance Society", kind: "society", category: "Arts", image: "dance", meets: "Tue/Thu/Sat, 7 pm · Activity Centre", description: "Hip-hop, contemporary, and classical crews. Choreo workshops and the annual showcase." },
    { slug: "film-society", name: "Film & Media Society", kind: "society", category: "Arts", image: "film", meets: "Screenings, Fridays 7:30 pm · Auditorium", description: "Weekly screenings with discussion, a student film unit, and workshops on editing, sound, and colour." },
  ];
  const clubs = {};
  for (const c of clubData) {
    const { image, ...rest } = c;
    clubs[c.slug] = await prisma.club.create({
      data: { ...rest, imageUrl: img(image) },
    });
  }

  console.log("Creating memberships...");
  await prisma.membership.createMany({
    data: [
      { userId: demo.id, clubId: clubs["bennett-coders"].id },
      { userId: demo.id, clubId: clubs["photography-society"].id },
      { userId: demo.id, clubId: clubs["e-cell"].id },
      { userId: students[1].id, clubId: clubs["photography-society"].id },
      { userId: students[1].id, clubId: clubs["music-collective"].id },
      { userId: students[1].id, clubId: clubs["dance-society"].id },
      { userId: students[2].id, clubId: clubs["robotics-club"].id },
      { userId: students[2].id, clubId: clubs["trekking-club"].id },
      { userId: students[3].id, clubId: clubs["debate-union"].id },
      { userId: students[3].id, clubId: clubs["literary-society"].id },
    ],
  });

  console.log("Creating events...");
  const eventData = [
    { slug: "hack-night-october", title: "Hack Night: Build a Weekend Project", club: "bennett-coders", image: "coding", category: "Workshop", location: "N Block, Lab 204", start: days(2, 18), hrs: 4, capacity: 40, description: "Bring an idea or join a team. We break for pizza at 8 pm and demo at 10 pm. Laptops and a willingness to Google required." },
    { slug: "robotics-build-session", title: "Line-Follower Build Session", club: "robotics-club", image: "robotics", category: "Workshop", location: "Mechanical Workshop", start: days(5, 15), hrs: 3, capacity: 24, description: "Assemble and tune a line-follower from the club kit. Soldering irons and a test track provided." },
    { slug: "startup-pitch-clinic", title: "Pitch Clinic: Sharpen Your 3-Minute Pitch", club: "e-cell", image: "startup", category: "Workshop", location: "Business School, Room 210", start: days(6, 17), hrs: 2, capacity: 30, description: "Practice your pitch in front of a friendly panel and get structured feedback on story, ask, and slides." },
    { slug: "campus-quiz-league", title: "Campus Quiz League: Round 3", club: "quiz-club", image: "quiz", category: "Practice", location: "Humanities Hall, Room 12", start: days(4, 17), hrs: 2, capacity: 60, description: "Teams of three. General and current-affairs rounds with an editorial discussion afterwards." },
    { slug: "sunrise-ridge-trek", title: "Sunrise Ridge Day Trek", club: "trekking-club", image: "trekking", category: "Trip", location: "Depart from North Car Park", start: days(9, 4, 30), hrs: 9, capacity: 25, description: "A moderate 12 km trek to the ridge for sunrise. Transport leaves at 4:30 am sharp. Bring water, snacks, and layers. Kit check is the Friday before." },
    { slug: "valorant-campus-cup", title: "Valorant Campus Cup — Group Stage", club: "esports-club", image: "esports", category: "Practice", location: "Gaming Room + streamed", start: days(3, 18), hrs: 4, capacity: 40, description: "Best-of-one group games. Rosters of five plus one sub. Check in 30 minutes before your slot." },
    { slug: "poetry-open-mic", title: "Poetry & Prose Open Mic", club: "literary-society", image: "literary", category: "Social", location: "LRC Discussion Commons", start: days(7, 18), hrs: 2, capacity: null, description: "Read your own work or a favourite piece. Five minutes a slot. Listeners very welcome." },
    { slug: "intro-to-parliamentary-debate", title: "Intro to Parliamentary Debate", club: "debate-union", image: "debate", category: "Workshop", location: "Humanities Hall, Room 8", start: days(6, 16), hrs: 2, capacity: 30, description: "New to debate? This session covers formats, roles, and a practice round. No prep needed." },
    { slug: "open-mic-night", title: "Open Mic Night", club: "music-collective", image: "music", category: "Social", location: "Student Centre Cafe", start: days(3, 19, 30), hrs: 2.5, capacity: null, description: "Music, poetry, stand-up, whatever you have been practising. Sign up on the night or just come to watch." },
    { slug: "golden-hour-photo-walk", title: "Golden Hour Photo Walk", club: "photography-society", image: "photography", category: "Meetup", location: "Meet at the Main Gate", start: days(4, 17), hrs: 2, capacity: 20, description: "A slow walk around the quad and lake shooting the evening light. Loaner cameras are first come, first served." },
    { slug: "contemporary-dance-workshop", title: "Contemporary Dance Workshop", club: "dance-society", image: "dance", category: "Workshop", location: "Activity Centre, Studio 2", start: days(8, 19), hrs: 1.5, capacity: 25, description: "A guided contemporary class open to all levels. Wear something you can move in; come barefoot or in socks." },
    { slug: "short-film-screening", title: "Student Short Film Screening", club: "film-society", image: "film", category: "Social", location: "Main Auditorium", start: days(10, 19, 30), hrs: 2, capacity: 120, description: "A programme of shorts made by the student film unit this term, followed by a short Q&A with the makers." },
    { slug: "autumn-career-fair", title: "Autumn Career Fair", club: null, image: "career", category: "Fair", location: "Sports Complex, Main Hall", start: days(12, 10), hrs: 6, capacity: null, description: "Over 40 employers across tech, finance, consulting, and non-profits. Bring printed CVs. Dress smart casual." },
    { slug: "wellbeing-week-yoga", title: "Wellbeing Week: Morning Yoga", club: null, image: "yoga", category: "Social", location: "Central Lawn", start: days(5, 8), hrs: 1, capacity: null, description: "Free drop-in yoga on the lawn to open Wellbeing Week. Mats provided. All levels." },
  ];
  const events = {};
  for (const e of eventData) {
    events[e.slug] = await prisma.event.create({
      data: {
        slug: e.slug,
        title: e.title,
        description: e.description,
        location: e.location,
        category: e.category,
        startsAt: e.start,
        endsAt: hoursLater(e.start, e.hrs),
        capacity: e.capacity,
        imageUrl: img(e.image),
        clubId: e.club ? clubs[e.club].id : null,
      },
    });
  }

  console.log("Creating RSVPs...");
  await prisma.rsvp.createMany({
    data: [
      { userId: demo.id, eventId: events["hack-night-october"].id, status: "going" },
      { userId: demo.id, eventId: events["autumn-career-fair"].id, status: "going" },
      { userId: demo.id, eventId: events["golden-hour-photo-walk"].id, status: "interested" },
      { userId: students[1].id, eventId: events["open-mic-night"].id, status: "going" },
      { userId: students[1].id, eventId: events["golden-hour-photo-walk"].id, status: "going" },
      { userId: students[2].id, eventId: events["sunrise-ridge-trek"].id, status: "going" },
      { userId: students[2].id, eventId: events["robotics-build-session"].id, status: "going" },
      { userId: students[3].id, eventId: events["intro-to-parliamentary-debate"].id, status: "going" },
    ],
  });

  console.log("Creating hackathons...");
  const hackData = [
    { slug: "hackbennett-2025", title: "HackBennett", organiser: "Bennett Coders × E-Cell", theme: "Open innovation", mode: "hybrid", venue: "N Block Atrium", prizePool: "₹2,00,000 prize pool", teamMin: 2, teamMax: 4, start: days(14, 10), hrs: 36, registerBy: days(9, 23, 59), image: "hackathon", description: "The flagship 36-hour hackathon. Build anything around the open-innovation theme. Mentors from industry drop in through the night, hardware is available on loan, and judging is on impact, craft, and demo." },
    { slug: "buildwithai", title: "BuildWithAI", organiser: "Google Developer Group on Campus", theme: "Applied AI & ML", mode: "offline", venue: "LRC, Second Floor Lab", prizePool: "₹1,00,000", teamMin: 1, teamMax: 3, start: days(21, 9), hrs: 24, registerBy: days(16, 23, 59), image: "coding", description: "A focused 24-hour build on applied machine learning. Free credits for hosted model APIs, a starter-kit repo, and workshops on evaluation and responsible use." },
    { slug: "robosprint", title: "RoboSprint", organiser: "Robotics Club", theme: "Autonomous systems", mode: "offline", venue: "Mechanical Workshop", prizePool: "₹75,000", teamMin: 2, teamMax: 4, start: days(28, 9), hrs: 30, registerBy: days(21, 23, 59), image: "robotics", description: "Design and demo an autonomous robot against a fixed course. Standard chassis kits provided; bring your own sensors if you like." },
    { slug: "fintech-weekend", title: "FinTech Weekend", organiser: "Entrepreneurship Cell", theme: "Financial technology", mode: "hybrid", venue: "Business School Auditorium", prizePool: "₹1,50,000 + incubation", teamMin: 2, teamMax: 5, start: days(35, 17), hrs: 48, registerBy: days(28, 23, 59), image: "startup", description: "A weekend to prototype something in payments, lending, wealth, or insurance. Sandbox API access from partner banks and office hours with founders." },
    { slug: "intra-hostel-game-jam", title: "Intra-Hostel Game Jam", organiser: "Esports Club", theme: "Game development", mode: "offline", venue: "Hostel Common Rooms", prizePool: "Goodies + studio internships", teamMin: 1, teamMax: 4, start: days(5, 18), hrs: 40, registerBy: days(-1, 23, 59), image: "esports", description: "A relaxed weekend jam run out of the hostel common rooms. A theme is revealed at kickoff; ship something playable by Sunday evening." },
  ];
  const hackathons = {};
  for (const h of hackData) {
    hackathons[h.slug] = await prisma.hackathon.create({
      data: {
        slug: h.slug,
        title: h.title,
        organiser: h.organiser,
        description: h.description,
        theme: h.theme,
        mode: h.mode,
        venue: h.venue,
        prizePool: h.prizePool,
        teamMin: h.teamMin,
        teamMax: h.teamMax,
        startsAt: h.start,
        endsAt: hoursLater(h.start, h.hrs),
        registerBy: h.registerBy,
        imageUrl: img(h.image),
      },
    });
  }

  console.log("Creating hackathon registrations...");
  await prisma.hackathonRegistration.createMany({
    data: [
      { userId: demo.id, hackathonId: hackathons["hackbennett-2025"].id, teamName: "Null Pointers" },
      { userId: demo.id, hackathonId: hackathons["buildwithai"].id },
      { userId: students[2].id, hackathonId: hackathons["robosprint"].id, teamName: "Torque" },
      { userId: students[3].id, hackathonId: hackathons["fintech-weekend"].id },
    ],
  });

  console.log("Creating announcements...");
  await prisma.announcement.createMany({
    data: [
      { title: "LRC extends hours for exam season", body: "The Learning Resource Centre and all reading rooms move to 24-hour opening from the 15th through the end of term. Tap your student ID at the turnstile for entry after midnight. Silent floors will be strictly enforced.", audience: "campus", pinned: true },
      { title: "Wellbeing Week starts Monday", body: "A full week of free events: morning yoga on the Central Lawn, therapy dog visits, sleep workshops, and drop-in counselling. Full schedule on the noticeboard outside the Student Centre.", audience: "campus", pinned: true },
      { title: "Campus shuttle schedule change", body: "From next week the evening shuttle runs every 20 minutes until 11 pm on weekdays. The weekend service is unchanged.", audience: "campus" },
      { title: "Hostel mess feedback forms are open", body: "The termly mess feedback form is open until Friday. Your responses set the menu rotation for next term, so it is worth five minutes.", audience: "campus" },
      { title: "New student discount at the campus store", body: "Show your student card for 15 percent off stationery and lab supplies through the end of the month.", audience: "campus" },
      { title: "HackBennett: form your teams early", body: "Registration closes in nine days. Drop your project idea in the club channel so people can find you — solo hackers welcome, we help match you into a team at kickoff.", audience: "club", clubId: clubs["bennett-coders"].id },
      { title: "Loaner camera pool has two new mirrorless bodies", body: "Thanks to the equipment grant we have added two mirrorless cameras to the loan pool. The booking sheet is in the club room and on the shared calendar.", audience: "club", clubId: clubs["photography-society"].id },
      { title: "Debate squad selection this week", body: "Selection rounds for the inter-college tournament squad are Thursday and Friday. Sign up for a slot at practice.", audience: "club", pinned: true, clubId: clubs["debate-union"].id },
      { title: "E-Cell incubator office hours", body: "Booking is open for 20-minute slots with the incubator team on Wednesday afternoon. Bring a one-pager or just questions.", audience: "club", clubId: clubs["e-cell"].id },
    ],
  });

  console.log("\nSeed complete.");
  console.log("Demo login:  aarav@campus.edu  /  password123");
  console.log("Other students (same password): diya@campus.edu, kabir@campus.edu, meera@campus.edu");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
