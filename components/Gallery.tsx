type GalleryImage = { src: string; webp?: string; alt: string; width?: number; height?: number };

export function Gallery({
  label,
  image,
  images,
}: {
  label: string;
  image?: GalleryImage;
  images?: GalleryImage[];
}) {
  const frames = images && images.length > 0 ? images : image ? [image] : [];
  if (frames.length === 0) {
    return (
      <div className="gallery gallery-single">
        <div className="gallery-frame media-hold">
          <p>{label}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="gallery gallery-single">
      {frames.map((frame) => (
        <div className="gallery-frame photo-frame" key={frame.src}>
          <picture>
            {frame.webp ? <source srcSet={frame.webp} type="image/webp" /> : null}
            <img src={frame.src} width={frame.width} height={frame.height} alt={frame.alt} />
          </picture>
        </div>
      ))}
    </div>
  );
}
