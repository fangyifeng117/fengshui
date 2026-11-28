import { BRAND_LATIN, BRAND_NAME } from "@/lib/public-config";

export function BrandLockup() {
  return (
    <span className="wordmark-lockup">
      <span className="brand-seal" aria-hidden="true">
        福
      </span>
      <span className="wordmark-text">
        <span>{BRAND_NAME}</span>
        <small>{BRAND_LATIN}</small>
      </span>
    </span>
  );
}
