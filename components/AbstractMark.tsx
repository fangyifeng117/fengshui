export function AbstractMark({ label }: { label: string }) {
  return (
    <svg className="abstract-mark" viewBox="0 0 320 240" role="img" aria-label={label}>
      <rect width="320" height="240" fill="#fbf7f0" />
      <circle cx="118" cy="120" r="36" fill="none" stroke="#241f1c" strokeWidth="3" />
      <circle cx="196" cy="108" r="18" fill="none" stroke="#8e2a22" strokeWidth="3" />
      <path d="M64 176h192" stroke="#241f1c" strokeOpacity="0.35" />
    </svg>
  );
}
