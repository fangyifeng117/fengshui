import { EXACT_DISCLAIMER } from "@/lib/disclaimer";

export function ExactDisclaimer({ translation }: { translation?: string }) {
  return (
    <aside className="exact-disclaimer">
      <p>{EXACT_DISCLAIMER}</p>
      {translation ? <p lang="zh">{translation}</p> : null}
    </aside>
  );
}
