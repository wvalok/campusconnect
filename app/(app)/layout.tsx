import { NavBar } from "@/components/NavBar";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen">
      <NavBar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-600">
        CampusConnect · a student project for Bennett University · sample data for
        demonstration
      </footer>
    </div>
  );
}
