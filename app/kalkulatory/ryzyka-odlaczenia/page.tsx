"use client"

import Link from "next/link"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { WerdyktPanel } from "@/components/werdykt"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { RYZYKA } from "@/components/siec/tresci-przejscia"
import { KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU, PrzelacznikSegmentu } from "@/components/siec/wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * M14 — D9 „Ryzyka odłączenia” (shared, F9 for firma: + RF1–RF3), Wzorzec E. `03_M14` §5,
 * opracowanie §5.1. Each item is confirmed by the user; the confidence mark of the source stays visible.
 */
export default function RyzykaOdlaczeniaPage() {
  const t = useTranslate()
  const [{ segment }, setSegment] = usePersistedDraft(KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU)
  const [stan, setStan] = usePersistedDraft<{ potwierdzone: string[] }>("siec-ryzyka-odlaczenia", { potwierdzone: [] })
  const items = RYZYKA.filter((r) => segment === "firma" || !r.tylkoFirma)
  const potwierdzone = stan.potwierdzone.filter((id) => items.some((r) => r.id === id))
  const toggle = (id: string) =>
    setStan((p) => ({ potwierdzone: p.potwierdzone.includes(id) ? p.potwierdzone.filter((x) => x !== id) : [...p.potwierdzone, id] }))

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyka-odlaczenia" />
      <NaglowekEkranu tytul={t("UI-RYZ-TYTUL")} ekran="ryzyka-odlaczenia">
        {t("UI-RYZ-OPIS")}
      </NaglowekEkranu>
      <PrzelacznikSegmentu value={segment} onChange={(s) => setSegment({ segment: s })} />

      <ListaChecklist
        items={items}
        potwierdzoneIds={potwierdzone}
        onToggle={toggle}
        renderLabel={(r) => (
          <>
            <span className="block font-medium">
              {r.id}. {t(r.tytul)} <span className="text-caption text-muted-foreground">{r.pewnosc}</span>
            </span>
            <span className="block text-muted-foreground">{t("UI-RYZ-SKUTEK", { tekst: t(r.skutek) })}</span>
            <span className="block text-muted-foreground">
              {t("UI-RYZ-CO-ZROBIC", { tekst: t(r.pomoc) })}{" "}
              {r.link && (
                <Link className="underline" href={r.link.href}>
                  {t(r.link.etykieta)} →
                </Link>
              )}
            </span>
          </>
        )}
      />

      {potwierdzone.length === items.length ? (
        <WerdyktPanel poziom="ok" etykieta={t("UI-RYZ-WSZYSTKIE")}>
          <p className="text-small">
            {t("UI-RYZ-NASTEPNY")}{" "}
            <Link className="underline" href="/kalkulatory/rezygnacja-z-przylacza">
              {t("UI-RYZ-LINK-PROCEDURA")}
            </Link>{" "}
            {t("UI-RYZ-KROKI-ODWRACALNE")}
          </p>
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-RYZ-SPRAWDZONO", { n: potwierdzone.length, wszystkie: items.length })} />
      )}
    </main>
  )
}
