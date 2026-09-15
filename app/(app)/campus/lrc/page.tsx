import { requireUser } from "@/lib/auth";
import { LRC_INFO } from "@/lib/campus";
import {
  CampusResource,
  InfoCard,
  Bullets,
  Rows,
} from "@/components/CampusResource";

export const metadata = { title: "LRC access" };

export default async function LrcPage() {
  await requireUser();

  return (
    <CampusResource
      title="Learning Resource Centre (LRC)"
      intro={LRC_INFO.intro}
      image="/img/lrc.jpg"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Getting in">
          <Bullets items={LRC_INFO.access} />
        </InfoCard>

        <InfoCard title="Floor guide">
          <Rows
            rows={LRC_INFO.floorGuide.map((f) => ({
              left: f.floor,
              right: f.use,
            }))}
          />
        </InfoCard>

        <InfoCard title="Facilities">
          <Bullets items={LRC_INFO.facilities} />
        </InfoCard>

        <InfoCard title="Quiet-zone etiquette">
          <p>{LRC_INFO.etiquette}</p>
        </InfoCard>
      </div>
    </CampusResource>
  );
}
