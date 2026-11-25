export function Gallery({
  label,
  image,
}: {
  label: string;
  image?: { src: string; webp?: string; alt: string; width?: number; height?: number };
}) {
  if (!image) {
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
      <div className="gallery-frame photo-frame">
        <picture>
          {image.webp ? <source srcSet={image.webp} type="image/webp" /> : null}
          <img src={image.src} width={image.width} height={image.height} alt={image.alt} />
        </picture>
      </div>
    </div>
  );
}
