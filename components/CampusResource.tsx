import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export function CampusResource({
  title,
  intro,
  image,
  children,
}: {
  title: string;
  intro: string;
  image: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Link
        href="/campus"
        className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> Campus guide
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-44 w-full sm:h-56">
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 900px"
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {intro}
          </p>
        </div>
      </div>

      {children}

      <p className="text-xs text-slate-400 dark:text-slate-600">
        Sample content for the demo — timings, room numbers, and contacts are
        placeholders.
      </p>
    </div>
  );
}

export function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <div className="mt-3 text-sm text-slate-700 dark:text-slate-200">
        {children}
      </div>
    </section>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Rows({
  rows,
}: {
  rows: { left: string; right: string }[];
}) {
  return (
    <dl className="divide-y divide-slate-100 dark:divide-slate-800">
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between gap-4 py-2">
          <dt className="text-slate-500 dark:text-slate-400">{r.left}</dt>
          <dd className="text-right font-medium">{r.right}</dd>
        </div>
      ))}
    </dl>
  );
}
