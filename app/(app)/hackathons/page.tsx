import { Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getHackathons } from "@/lib/hackathons";
import { HackathonCard, EmptyState, PageHeader } from "@/components/cards";

export const metadata = { title: "Hackathons" };

export default async function HackathonsPage() {
  const user = await requireUser();
  const hackathons = await getHackathons(user.id);

  const now = Date.now();
  const open = hackathons.filter((h) => h.registerBy.getTime() >= now);
  const closedOrRunning = hackathons.filter((h) => h.registerBy.getTime() < now);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Trophy}
        title="Hackathons"
        subtitle="Build weekends run by student clubs and campus partners. Register to hold your spot."
      />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          Registration open
        </h2>
        {open.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {open.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        ) : (
          <EmptyState>No hackathons are open for registration right now.</EmptyState>
        )}
      </section>

      {closedOrRunning.length ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            Closed &amp; upcoming
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {closedOrRunning.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
