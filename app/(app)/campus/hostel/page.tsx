import { requireUser } from "@/lib/auth";
import { HOSTEL_INFO } from "@/lib/campus";
import {
  CampusResource,
  InfoCard,
  Bullets,
  Rows,
} from "@/components/CampusResource";

export const metadata = { title: "Hostel" };

export default async function HostelPage() {
  await requireUser();

  return (
    <CampusResource
      title="Hostel"
      intro={HOSTEL_INFO.intro}
      image="/img/hostel.jpg"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Room types">
          <Bullets
            items={HOSTEL_INFO.roomTypes.map((r) => `${r.name} — ${r.note}`)}
          />
        </InfoCard>

        <InfoCard title="Mess timings">
          <Rows
            rows={HOSTEL_INFO.mess.map((m) => ({ left: m.meal, right: m.time }))}
          />
        </InfoCard>

        <InfoCard title="Residence rules">
          <Bullets items={HOSTEL_INFO.rules} />
        </InfoCard>

        <InfoCard title="Contacts">
          <Rows
            rows={HOSTEL_INFO.contacts.map((c) => ({
              left: c.role,
              right: c.detail,
            }))}
          />
        </InfoCard>
      </div>
    </CampusResource>
  );
}
