import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page narrow">
      <p className="kicker">404</p>
      <h1>That page is not in this demo.</h1>
      <p>
        <Link href="/products">Browse samples</Link>
      </p>
    </div>
  );
}
