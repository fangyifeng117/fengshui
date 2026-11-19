"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { src: string; alt: string };

export function Gallery({
  images,
  sampleLabel = "Sample",
  showLabel = "Show sample illustration",
}: {
  images: GalleryImage[];
  sampleLabel?: string;
  showLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div className={images.length > 1 ? "gallery" : "gallery gallery-single"}>
      <figure className="gallery-main">
        <div className="gallery-frame">
          <Image src={current.src} alt={current.alt} fill sizes="(max-width: 700px) 100vw, 50vw" priority />
          <span className="pill">{sampleLabel}</span>
        </div>
      </figure>
      {images.length > 1 ? (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className="thumb"
              aria-pressed={index === active}
              aria-label={`${showLabel} ${index + 1}`}
              onClick={() => setActive(index)}
            >
              <Image src={image.src} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
