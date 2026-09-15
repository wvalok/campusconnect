import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { CAMPUS, CAMPUS_PLACES, type CampusPlace } from "@/lib/campus";

export const metadata = { title: "Campus map" };

const KIND_LABEL: Record<CampusPlace["kind"], string> = {
  academic: "Academic",
  residence: "Residence",
  sport: "Sport",
  food: "Food",
  service: "Services",
  landmark: "Landmark",
};

export default async function CampusMapPage() {
  await requireUser();

  const { lat, lng } = CAMPUS;
  const d = 0.006;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const full = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  const byKind = CAMPUS_PLACES.reduce<Record<string, CampusPlace[]>>(
    (acc, place) => {
      (acc[place.kind] ??= []).push(place);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <Link
        href="/campus"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> Campus guide
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Campus map
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {CAMPUS.name} · {CAMPUS.addressLines.join(", ")}
        </p>
      </div>

      <div className="card overflow-hidden">
        <iframe
          title="Bennett University campus map"
          src={embed}
          className="h-[360px] w-full border-0 sm:h-[440px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 p-3 text-xs dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-500">
            Map data © OpenStreetMap contributors · tiles not loading? open the
            full map
          </span>
          <a
            href={full}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-brand-600 dark:text-brand-400"
          >
            Open larger map <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          Key locations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(byKind).map(([kind, places]) => (
            <div key={kind} className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {KIND_LABEL[kind as CampusPlace["kind"]]}
              </p>
              <ul className="mt-2 space-y-2">
                {places.map((place) => (
                  <li key={place.key}>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {place.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {place.blurb}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 dark:text-slate-600">
        Building names and the pin location are approximate, for the demo.
      </p>
    </div>
  );
}
