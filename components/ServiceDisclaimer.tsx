import { SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";

export function ServiceDisclaimer({ translation }: { translation?: string }) {
  return (
    <aside className="exact-disclaimer">
      <p>{SERVICE_DRAFT_DISCLAIMER}</p>
      {translation ? <p lang="zh">{translation}</p> : null}
    </aside>
  );
}
