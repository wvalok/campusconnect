import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Library,
  MapPin,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { CAMPUS } from "@/lib/campus";
import { PageHeader } from "@/components/cards";

export const metadata = { title: "Campus" };

const sections = [
  {
    href: "/campus/hostel",
    icon: Building2,
    title: "Hostel",
    blurb: "Room types, mess timings, rules, and residence-desk contacts.",
    image: "/img/hostel.jpg",
  },
  {
    href: "/campus/library",
    icon: BookOpen,
    title: "Library",
    blurb: "Borrowing rules, opening hours, e-resources, and study rooms.",
    image: "/img/library.jpg",
  },
  {
    href: "/campus/lrc",
    icon: Library,
    title: "LRC access",
    blurb: "How to get in, the floor guide, printing, and quiet-zone etiquette.",
    image: "/img/lrc.jpg",
  },
  {
    href: "/campus/map",
    icon: MapPin,
    title: "Campus map",
    blurb: "An interactive map and a guide to the main buildings.",
    image: "/img/map.jpg",
  },
];

export default async function CampusPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MapPin}
        title="Campus guide"
        subtitle={`${CAMPUS.name} · ${CAMPUS.addressLines.join(", ")}`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ href, icon: Icon, title, blurb, image }) => (
          <Link key={href} href={href} className="card card-hover overflow-hidden">
            <div className="relative h-32 w-full">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                  {title} <ArrowRight className="h-3.5 w-3.5 text-brand-500" />
                </p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {blurb}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600">
        Campus information here is sample content for the demo. Check official
        Bennett University channels for current timings, contacts, and rules.
      </p>
    </div>
  );
}
