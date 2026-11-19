import Link from "next/link";
import { AbstractMark } from "@/components/AbstractMark";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";
import { places } from "@/lib/places";

export function PlacesIndex({ locale, selected }: { locale: Locale; selected?: string }) {
  const text = copy(locale);
  const visible = selected ? places.filter((place) => place.slug === selected) : places;
  return (
    <div className="page">
      <header className="section-head">
        <h1>{text.places.title}</h1>
        <p>{text.places.lede}</p>
        <p>{text.places.notATemple}</p>
      </header>
      <form className="filters" action={hrefFor(locale, "/temples")} method="get">
        <label>
          {text.places.filter}
          <select name="place" defaultValue={selected ?? ""}>
            <option value="">{text.places.all}</option>
            {places.map((place) => (
              <option key={place.slug} value={place.slug}>
                {place.name[locale]}
              </option>
            ))}
          </select>
        </label>
        <button className="button" type="submit">
          {text.places.apply}
        </button>
      </form>
      <div className="place-grid">
        {visible.map((place) => (
          <Link key={place.slug} className="card" href={hrefFor(locale, `/temples/${place.slug}`)}>
            <AbstractMark label={text.demo} />
            <h2>{place.name[locale]}</h2>
            <p>{place.region[locale]}</p>
            <p>{place.theme[locale]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
