"use client"

import Link from "next/link"
import { useTranslate } from "@/lib/i18n/language-context"

/** One line under a form whose building-only fields are hidden because the site is a camper. */
export function PolaBudynkuUkryteInfo() {
  const t = useTranslate()
  return (
    <p className="text-small text-muted-foreground">
      {t("UI-OBIEKT-UKRYTO-POLA")}{" "}
      <Link href="/ustawienia" className="underline">
        {t("UI-OBIEKT-UKRYTO-USTAWIENIA")}
      </Link>
    </p>
  )
}
