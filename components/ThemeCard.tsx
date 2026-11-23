import Link from "next/link";
import { hrefFor, type Locale } from "@/lib/locale";
import type { ThemeImage } from "@/lib/theme-images";

export function ThemeCard({ image, locale }: { image: ThemeImage; locale: Locale }) {
  return (
    <Link className="card" href={hrefFor(locale, image.href)}>
      <div className="card-media">
        {/* The two JPEG widths are already built. A runtime image optimizer is not required. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          srcSet={`${image.small} 640w, ${image.src} 960w`}
          sizes="(max-width: 720px) 100vw, 33vw"
          width={image.width}
          height={image.height}
          alt={image.alt[locale]}
          decoding="async"
        />
        <span className="pill">{image.label[locale]}</span>
      </div>
      <h3>{image.title[locale]}</h3>
      <p>{image.note[locale]}</p>
      <p className="theme-credit">{image.credit}</p>
    </Link>
  );
}
