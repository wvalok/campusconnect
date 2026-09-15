import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("public/img", { recursive: true });

// name -> list of candidate Unsplash photo ids (first that works wins)
const wanted = {
  "coding": ["photo-1517180102446-f3ece451e9d8", "photo-1555949963-aa79dcee981c", "photo-1461749280684-dccba630e2f6"],
  "hackathon": ["photo-1526374965328-7f61d4dc18c5", "photo-1504384308090-c894fdcc538d", "photo-1550439062-609e1531270e"],
  "photography": ["photo-1502920917128-1aa500764cbd", "photo-1516035069371-29a1b244cc32", "photo-1452587925148-ce544e77e70d"],
  "debate": ["photo-1475721027785-f74eccf877e2", "photo-1544928147-79a2dbc1f389", "photo-1560523159-4a9692d222f9"],
  "music": ["photo-1511671782779-c97d3d27a1d4", "photo-1470019693664-1d202d2c0907", "photo-1493225457124-a3eb161ffa5f"],
  "startup": ["photo-1552664730-d307ca884978", "photo-1531482615713-2afd69097998", "photo-1454165804606-c3d57bc86b40"],
  "trekking": ["photo-1551632811-561732d1e306", "photo-1533692328991-08159ff19fca", "photo-1454496522488-7a8e488e8606"],
  "career": ["photo-1521737711867-e3b97375f902", "photo-1524178232363-1fb2b075b655", "photo-1556761175-b413da4baf72"],
  "yoga": ["photo-1506126613408-eca07ce68773", "photo-1544367567-0f2fcb009e0b", "photo-1518611012118-696072aa579a"],
  "robotics": ["photo-1518770660439-4636190af475", "photo-1581091226825-a6a2a5aee158", "photo-1563207153-f403bf289096"],
  "literary": ["photo-1524995997946-a1c2e315a42f", "photo-1512820790803-83ca734da794", "photo-1519682337058-a94d519337bc"],
  "dance": ["photo-1508700115892-45ecd05ae2ad", "photo-1547153760-18fc86324498", "photo-1524594152303-9fd13543fe6e"],
  "quiz": ["photo-1434030216411-0b793f4b4173", "photo-1513258496099-48168024aec0", "photo-1546410531-bb4caa6b424d"],
  "film": ["photo-1489599849927-2ee91cede3ba", "photo-1485846234645-a62644f84728", "photo-1517604931442-7e0c8ed2963c"],
  "esports": ["photo-1542751371-adc38448a05e", "photo-1511512578047-dfb367046420", "photo-1493711662062-fa541adb3fc8"],
  "sports": ["photo-1461896836934-ffe607ba8211", "photo-1517649763962-0c623066013b", "photo-1526232761682-d26e03ac148e"],
  "library": ["photo-1521587760476-6c12a4b040da", "photo-1507842217343-583bb7270b66", "photo-1481627834876-b7833e8f5570"],
  "lrc": ["photo-1568667256549-094345857637", "photo-1568667256549-094345857637", "photo-1541339907198-e08756dedf3f"],
  "hostel": ["photo-1555854877-bab0e564b8d5", "photo-1493809842364-78817add7ffb", "photo-1560448204-e02f11c3d0e2"],
  "campus": ["photo-1607013251379-e6eecfffe234", "photo-1498243691581-b145c3f54a5a", "photo-1592280771190-3e2e4d571952"],
  "map": ["photo-1524661135-423995f22d0b", "photo-1569336415962-a4bd9f69cd83", "photo-1502920514313-52581002a659"],
};

async function tryDownload(name, ids) {
  for (const id of ids) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!res.ok) { console.log(`  ${name}: ${id} -> ${res.status}`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 3000) { console.log(`  ${name}: ${id} -> too small`); continue; }
      writeFileSync(`public/img/${name}.jpg`, buf);
      console.log(`ok  ${name}.jpg  (${(buf.length / 1024).toFixed(0)} KB, ${id})`);
      return true;
    } catch (e) {
      console.log(`  ${name}: ${id} -> ${e.message}`);
    }
  }
  console.log(`FAIL ${name} — no candidate worked`);
  return false;
}

let failed = 0;
for (const [name, ids] of Object.entries(wanted)) {
  const ok = await tryDownload(name, ids);
  if (!ok) failed++;
}
console.log(failed ? `\n${failed} image(s) missing` : "\nAll images downloaded");
