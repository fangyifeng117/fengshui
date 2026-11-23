export function Gallery({ label }: { label: string }) {
  return (
    <div className="gallery gallery-single">
      <div className="gallery-frame media-hold">
        <p>{label}</p>
      </div>
    </div>
  );
}
