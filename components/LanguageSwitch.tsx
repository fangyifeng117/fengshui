"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { hrefFor } from "@/lib/locale";

export function LanguageSwitch({ label }: { label: string }) {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  return (
    <nav className="lang-switch" aria-label={label}>
      <Link href={hrefFor("en", pathname)} hrefLang="en" lang="en" aria-current={locale === "en" ? "page" : undefined}>
        EN
      </Link>
      <Link href={hrefFor("zh", pathname)} hrefLang="zh" lang="zh" aria-current={locale === "zh" ? "page" : undefined}>
        中文
      </Link>
    </nav>
  );
}
