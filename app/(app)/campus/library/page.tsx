import { requireUser } from "@/lib/auth";
import { LIBRARY_INFO } from "@/lib/campus";
import {
  CampusResource,
  InfoCard,
  Bullets,
  Rows,
} from "@/components/CampusResource";

export const metadata = { title: "Library" };

export default async function LibraryPage() {
  await requireUser();

  return (
    <CampusResource
      title="Library"
      intro={LIBRARY_INFO.intro}
      image="/img/library.jpg"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Opening hours">
          <Rows
            rows={LIBRARY_INFO.hours.map((h) => ({
              left: h.day,
              right: h.time,
            }))}
          />
        </InfoCard>

        <InfoCard title="Borrowing">
          <Bullets items={LIBRARY_INFO.borrowing} />
        </InfoCard>

        <InfoCard title="Online databases">
          <div className="flex flex-wrap gap-2">
            {LIBRARY_INFO.eResources.map((r) => (
              <span key={r} className="chip">
                {r}
              </span>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="Study rooms">
          <p>{LIBRARY_INFO.studyRooms}</p>
        </InfoCard>
      </div>
    </CampusResource>
  );
}
