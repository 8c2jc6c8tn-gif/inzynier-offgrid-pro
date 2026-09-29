"use client"

import Link from "next/link"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { WerdyktPanel } from "@/components/werdykt"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { RYZYKA } from "@/components/siec/tresci-przejscia"
import { KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU, PrzelacznikSegmentu } from "@/components/siec/wspolne"

/**
 * M14 — D9 „Ryzyka odłączenia” (shared, F9 for firma: + RF1–RF3), Wzorzec E. `03_M14` §5,
 * opracowanie §5.1. Each item is confirmed by the user; the confidence mark of the source stays visible.
 */
export default function RyzykaOdlaczeniaPage() {
  const [{ segment }, setSegment] = usePersistedDraft(KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU)
  const [stan, setStan] = usePersistedDraft<{ potwierdzone: string[] }>("siec-ryzyka-odlaczenia", { potwierdzone: [] })
  const items = RYZYKA.filter((r) => segment === "firma" || !r.tylkoFirma)
  const potwierdzone = stan.potwierdzone.filter((id) => items.some((r) => r.id === id))
  const toggle = (id: string) =>
    setStan((p) => ({ potwierdzone: p.potwierdzone.includes(id) ? p.potwierdzone.filter((x) => x !== id) : [...p.potwierdzone, id] }))

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyka-odlaczenia" />
      <NaglowekEkranu tytul="Ryzyka odłączenia od sieci">
        Dziesięć ryzyk pełnego odłączenia (scenariusz D), a dla firmy trzy kolejne. Odhacz każde, gdy je sprawdzisz. Znak przy
        pozycji mówi, na ile jest pewna: ✅ prawo, fizyka lub praktyka bez wątpliwości; 🔎A kilka zgodnych źródeł; 🔎B jedno źródło
        albo wiedza ekspercka. M14, ekran D9 / F9.
      </NaglowekEkranu>
      <PrzelacznikSegmentu value={segment} onChange={(s) => setSegment({ segment: s })} />

      <ListaChecklist
        items={items}
        potwierdzoneIds={potwierdzone}
        onToggle={toggle}
        renderLabel={(r) => (
          <>
            <span className="block font-medium">
              {r.id}. {r.tytul} <span className="text-caption text-muted-foreground">{r.pewnosc}</span>
            </span>
            <span className="block text-muted-foreground">Skutek: {r.skutek}</span>
            <span className="block text-muted-foreground">
              Co zrobić: {r.pomoc}{" "}
              {r.link && (
                <Link className="underline" href={r.link.href}>
                  {r.link.etykieta} →
                </Link>
              )}
            </span>
          </>
        )}
      />

      {potwierdzone.length === items.length ? (
        <WerdyktPanel poziom="ok" etykieta="Wszystkie ryzyka sprawdzone">
          <p className="text-small">
            Następny krok:{" "}
            <Link className="underline" href="/kalkulatory/rezygnacja-z-przylacza">
              procedura rezygnacji z przyłącza
            </Link>{" "}
            — kroki 1–4 są odwracalne, zacznij od testu wyspy przez pełną zimę.
          </p>
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta={`Sprawdzono ${potwierdzone.length} z ${items.length} ryzyk`} />
      )}
    </main>
  )
}
