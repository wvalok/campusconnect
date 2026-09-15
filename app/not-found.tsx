import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div>
        <p className="text-5xl font-bold text-brand-600 dark:text-brand-400">
          404
        </p>
        <h1 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The event, society, hackathon, or announcement may have been removed.
        </p>
        <Link href="/" className="btn-primary mt-4">
          Back to home
        </Link>
      </div>
    </div>
  );
}
