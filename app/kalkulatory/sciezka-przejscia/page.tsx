"use client"

import Link from "next/link"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { KrokZMedia } from "@/components/wzorce/krok-z-media"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU, PrzelacznikSegmentu } from "@/components/siec/wspolne"
import { useTranslate } from "@/lib/i18n/language-context"
import { ZnakStanu } from "@/components/ui/znak-stanu"

type Odnosnik = { href: string; label: string }
/** `tytul`, `opis` and `label` are translation keys (`t()`). */
type Krok = { id: string; tytul: string; opis: string; ekrany: Record<Segment, Odnosnik[]> }

/**
 * The six steps of the chapter (03_M14 „Plan ekranów”). Each step only links to the screens that
 * compute it — the wizard has no engine of its own and never copies their results.
 */
const KROKI: Krok[] = [
  {
    id: "rachunek",
    tytul: "UI-SCZ-RACHUNEK-T",
    opis: "UI-SCZ-RACHUNEK-O",
    ekrany: {
      dom: [
        { href: "/kalkulatory/rachunek-dom", label: "UI-SCZ-L-RACHUNEK-DOM" },
        { href: "/kalkulatory/taryfa-g", label: "UI-SCZ-L-TARYFA-G" },
        { href: "/kalkulatory/depozyt-prosumencki", label: "UI-SCZ-L-DEPOZYT" },
      ],
      firma: [
        { href: "/kalkulatory/rachunek-firma", label: "UI-SCZ-L-RACHUNEK-FIRMA" },
        { href: "/kalkulatory/taryfy-c", label: "UI-SCZ-L-TARYFY-C" },
        { href: "/kalkulatory/moc-umowna", label: "UI-SCZ-L-MOC-UMOWNA" },
      ],
    },
  },
  {
    id: "zuzycie",
    tytul: "UI-SCZ-ZUZYCIE-T",
    opis: "UI-SCZ-ZUZYCIE-O",
    ekrany: {
      dom: [{ href: "/kalkulatory/zuzycie-miesieczne", label: "UI-SCZ-L-ZUZYCIE-DOM" }],
      // Firm consumption per month is entered on F6 (PvFirmy owns `siec-zuzycie-firma`).
      firma: [{ href: "/kalkulatory/pv-w-firmie", label: "UI-SCZ-L-ZUZYCIE-FIRMA" }],
    },
  },
  {
    id: "pv-magazyn",
    tytul: "UI-SCZ-PV-T",
    opis: "UI-SCZ-PV-O",
    ekrany: {
      dom: [{ href: "/kalkulatory/pv-i-magazyn", label: "UI-SCZ-PV-T" }],
      firma: [
        { href: "/kalkulatory/pv-w-firmie", label: "UI-SCZ-L-PV-FIRMA" },
        { href: "/kalkulatory/magazyn-firmy", label: "UI-SCZ-L-BESS" },
      ],
    },
  },
  {
    id: "zima",
    tytul: "UI-SCZ-ZIMA-T",
    opis: "UI-SCZ-ZIMA-O",
    ekrany: {
      dom: [
        { href: "/kalkulatory/zima-bez-sieci", label: "UI-SCZ-L-ZIMA" },
        { href: "/kalkulatory/agregat-jako-zapas", label: "UI-SCZ-L-AGREGAT-ZAPAS" },
      ],
      // No separate winter screen for a firm: the island balance of F8 (scenario D) shows it.
      firma: [
        { href: "/kalkulatory/scenariusze-firma", label: "UI-SCZ-L-BILANS-D" },
        { href: "/kalkulatory/agregat-pradotworczy", label: "UI-SCZ-L-AGREGAT" },
      ],
    },
  },
  {
    id: "scenariusze",
    tytul: "UI-SCZ-SCEN-T",
    opis: "UI-SCZ-SCEN-O",
    ekrany: {
      dom: [{ href: "/kalkulatory/scenariusze-dom", label: "UI-SCZ-L-SCEN-DOM" }],
      firma: [{ href: "/kalkulatory/scenariusze-firma", label: "UI-SCZ-L-SCEN-FIRMA" }],
    },
  },
  {
    id: "ryzyka",
    tytul: "UI-SCZ-RYZYKA-T",
    opis: "UI-SCZ-RYZYKA-O",
    ekrany: {
      dom: [
        { href: "/kalkulatory/ryzyka-odlaczenia", label: "UI-SCZ-L-RYZYKA" },
        { href: "/kalkulatory/rezygnacja-z-przylacza", label: "UI-SCZ-L-REZYGNACJA" },
        { href: "/kalkulatory/przelacznik-siec-wyspa", label: "UI-SCZ-L-PRZELACZNIK" },
      ],
      firma: [
        { href: "/kalkulatory/ryzyka-odlaczenia", label: "UI-SCZ-L-RYZYKA-FIRMA" },
        { href: "/kalkulatory/rezygnacja-z-przylacza", label: "UI-SCZ-L-PROCEDURA-B2B" },
        { href: "/kalkulatory/przelacznik-siec-wyspa", label: "UI-SCZ-L-PRZELACZNIK" },
      ],
    },
  },
]

/**
 * M14 — Kreator „Ścieżka przejścia” (both tiles, Wzorzec F + summary G). Progress is kept in a
 * local draft; the segment switch is shared with the other Przejście screens.
 */
export default function SciezkaPrzejsciaPage() {
  const t = useTranslate()
  const [{ segment }, setSegment] = usePersistedDraft(KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU)
  const [stan, setStan] = usePersistedDraft<{ zrobione: string[] }>("siec-sciezka-przejscia", { zrobione: [] })
  const przelacz = (id: string) =>
    setStan((p) => ({ zrobione: p.zrobione.includes(id) ? p.zrobione.filter((x) => x !== id) : [...p.zrobione, id] }))

  const zrobione = KROKI.filter((k) => stan.zrobione.includes(k.id))
  const nastepny = KROKI.find((k) => !stan.zrobione.includes(k.id))

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sciezka-przejscia" />
      <NaglowekEkranu tytul={t("UI-SCZ-TYTUL")} ekran="sciezka-przejscia">
        {t("UI-SCZ-OPIS")}
      </NaglowekEkranu>

      <PrzelacznikSegmentu value={segment} onChange={(s) => setSegment({ segment: s })} />

      <ol className="flex flex-col gap-3">
        {KROKI.map((k, i) => (
          <KrokZMedia key={k.id} numer={i + 1} tytul={t(k.tytul)}>
            <p>{t(k.opis)}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {k.ekrany[segment].map((e) => (
                <li key={e.href}>
                  <Link className="underline" href={e.href}>
                    {t(e.label)} →
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <PoleCheckbox
                id={`sciezka-${k.id}`}
                checked={stan.zrobione.includes(k.id)}
                onChange={() => przelacz(k.id)}
                label={t("UI-SCZ-ZROBIONE")}
              />
            </div>
          </KrokZMedia>
        ))}
      </ol>

      <WerdyktPanel
        poziom={nastepny ? "uwaga" : "ok"}
        etykieta={t("UI-SCZ-PODSUMOWANIE", { zrobione: zrobione.length, wszystkie: KROKI.length })}
      >
        {nastepny ? (
          <p className="text-small">
            {t("UI-SCZ-NASTEPNY")} <strong>{t(nastepny.tytul)}</strong>. {t("UI-SCZ-NASTEPNY-UWAGA")}
          </p>
        ) : (
          <p className="text-small">
            {t("UI-SCZ-WSZYSTKIE")}
          </p>
        )}
        <ul className="mt-2 flex flex-col gap-1 text-small">
          {KROKI.map((k) => (
            <li key={k.id}>
              {stan.zrobione.includes(k.id) ? <ZnakStanu poziom="ok" /> : "○ "}{t(k.tytul)}
            </li>
          ))}
        </ul>
        <button type="button" className="mt-3 w-fit rounded-md border px-3 py-1 text-small print:hidden" onClick={() => window.print()}>
          {t("UI-SCZ-DRUKUJ")}
        </button>
      </WerdyktPanel>
    </main>
  )
}
