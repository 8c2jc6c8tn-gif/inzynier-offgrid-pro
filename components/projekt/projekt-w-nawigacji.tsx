"use client"

import Link from "next/link"
import { useTranslate } from "@/lib/i18n/language-context"
import { useAktywnyProjekt, useListaProjektow } from "@/lib/projekt/use-projekt"
import { nazwaProjektu } from "./nazwa-projektu"

/** „Project: Name” — which project the screen works on; leads to the project list. Nothing until the list is known. */
export function ProjektWNawigacji({ className }: { className?: string }) {
  const t = useTranslate()
  const lista = useListaProjektow()
  const projekt = useAktywnyProjekt()
  if (!lista || !projekt) return null
  return (
    <Link href="/projekty" className={className ?? "w-fit text-xs text-muted-foreground hover:text-foreground hover:underline"}>
      {t("UI-PRJ-NAW-PROJEKT", { nazwa: nazwaProjektu(projekt, lista, t) })}
    </Link>
  )
}
