"use client"

/**
 * „This screen uses Polish data” (owner decision 25.11.2026): screens built on Polish tariffs, fees, laws or subsidies say so
 * when the open project is in another country. They keep working; the official amounts typed there are in the country's
 * currency. Screens for other countries are a later step (each screen will follow its country).
 */
import Link from "next/link"
import { useLanguage, useTranslate } from "@/lib/i18n/language-context"
import { nazwaKraju } from "@/lib/projekt/nazwa-kraju"
import { useKrajProjektu } from "@/lib/projekt/use-projekt"
import { useWaluta } from "@/lib/waluta/use-waluta"
import { kursEfektywny } from "@/lib/waluta/przelicz"

export function DotyczyPolski() {
  const t = useTranslate()
  const jezyk = useLanguage()
  const { kraj, waluta } = useKrajProjektu()
  const { stan } = useWaluta()
  if (kraj === "PL") return null
  // Without a rate the official amounts are not counted, and the screen falls back to its Polish rates — say it plainly.
  const brakKursu = kursEfektywny(waluta, stan.kursy?.kursy ?? {}, stan.preferencja.reczne, stan.preferencja.narzutProc) === null
  return (
    <p role="note" className="rounded-md border border-werdykt-uwaga-border bg-werdykt-uwaga/10 px-3 py-2 text-small">
      {t("UI-PRJ-DOTYCZY-POLSKI", { kraj: nazwaKraju(kraj, jezyk), waluta })}{" "}
      {brakKursu && <strong className="font-semibold">{t("UI-PRJ-BRAK-KURSU-KRAJU", { waluta })} </strong>}
      <Link href="/projekty" className="underline">
        {t("UI-PRJ-ZMIEN-KRAJ")}
      </Link>
    </p>
  )
}
