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

type Odnosnik = { href: string; label: string }
type Krok = { id: string; tytul: string; opis: string; ekrany: Record<Segment, Odnosnik[]> }

/**
 * The six steps of the chapter (03_M14 „Plan ekranów”). Each step only links to the screens that
 * compute it — the wizard has no engine of its own and never copies their results.
 */
const KROKI: Krok[] = [
  {
    id: "rachunek",
    tytul: "Mój rachunek",
    opis: "Ile płacisz dziś i ile z tego to „cena trzymania sieci” — koszty stałe, które znikną po odejściu.",
    ekrany: {
      dom: [
        { href: "/kalkulatory/rachunek-dom", label: "Mój rachunek dziś" },
        { href: "/kalkulatory/taryfa-g", label: "Która taryfa G" },
        { href: "/kalkulatory/depozyt-prosumencki", label: "Co tracę jako prosument" },
      ],
      firma: [
        { href: "/kalkulatory/rachunek-firma", label: "Mój rachunek dziś (C)" },
        { href: "/kalkulatory/taryfy-c", label: "Porównywarka taryf C" },
        { href: "/kalkulatory/moc-umowna", label: "Moc umowna" },
      ],
    },
  },
  {
    id: "zuzycie",
    tytul: "Moje zużycie",
    opis: "Zużycie miesiąc po miesiącu — zima decyduje o wszystkim, średnia roczna nie wystarczy.",
    ekrany: {
      dom: [{ href: "/kalkulatory/zuzycie-miesieczne", label: "Moje zużycie miesięcznie" }],
      // Firm consumption per month is entered on F6 (PvFirmy owns `siec-zuzycie-firma`).
      firma: [{ href: "/kalkulatory/pv-w-firmie", label: "Zużycie firmy miesięcznie (ekran PV w firmie)" }],
    },
  },
  {
    id: "pv-magazyn",
    tytul: "Ile PV i magazynu",
    opis: "Instalacja, która pokryje zużycie bez sieci, i jej koszt.",
    ekrany: {
      dom: [{ href: "/kalkulatory/pv-i-magazyn", label: "Ile PV i magazynu" }],
      firma: [
        { href: "/kalkulatory/pv-w-firmie", label: "PV w firmie i autokonsumpcja" },
        { href: "/kalkulatory/magazyn-firmy", label: "Magazyn (BESS) — strumienie korzyści" },
      ],
    },
  },
  {
    id: "zima",
    tytul: "Zima i agregat",
    opis: "Czy najgorszy miesiąc się domyka i ile godzin musi pracować agregat.",
    ekrany: {
      dom: [
        { href: "/kalkulatory/zima-bez-sieci", label: "Zima bez sieci" },
        { href: "/kalkulatory/agregat-jako-zapas", label: "Agregat jako zapas" },
      ],
      // No separate winter screen for a firm: the island balance of F8 (scenario D) shows it.
      firma: [
        { href: "/kalkulatory/scenariusze-firma", label: "Bilans bez sieci — scenariusz D" },
        { href: "/kalkulatory/agregat-pradotworczy", label: "Agregat prądotwórczy" },
      ],
    },
  },
  {
    id: "scenariusze",
    tytul: "Scenariusze A–D",
    opis: "Zostaję jak jest, dokładam PV, dokładam magazyn, odchodzę od sieci — koszt w latach i niezależność.",
    ekrany: {
      dom: [{ href: "/kalkulatory/scenariusze-dom", label: "Porównanie scenariuszy A–D" }],
      firma: [{ href: "/kalkulatory/scenariusze-firma", label: "Scenariusze A–D dla firmy" }],
    },
  },
  {
    id: "ryzyka",
    tytul: "Ryzyka i procedura",
    opis: "Co może pójść źle, czego nie da się odwrócić i jak bezpiecznie połączyć sieć, wyspę i agregat.",
    ekrany: {
      dom: [
        { href: "/kalkulatory/ryzyka-odlaczenia", label: "Ryzyka odłączenia" },
        { href: "/kalkulatory/rezygnacja-z-przylacza", label: "Jak zrezygnować z przyłącza" },
        { href: "/kalkulatory/przelacznik-siec-wyspa", label: "Przełącznik sieć/wyspa" },
      ],
      firma: [
        { href: "/kalkulatory/ryzyka-odlaczenia", label: "Ryzyka odłączenia firmy" },
        { href: "/kalkulatory/rezygnacja-z-przylacza", label: "Procedura i umowy B2B" },
        { href: "/kalkulatory/przelacznik-siec-wyspa", label: "Przełącznik sieć/wyspa" },
      ],
    },
  },
]

/**
 * M14 — Kreator „Ścieżka przejścia” (both tiles, Wzorzec F + summary G). Progress is kept in a
 * local draft; the segment switch is shared with the other Przejście screens.
 */
export default function SciezkaPrzejsciaPage() {
  const [{ segment }, setSegment] = usePersistedDraft(KLUCZ_SEGMENTU_PRZEJSCIA, POCZATKOWY_SEGMENTU)
  const [stan, setStan] = usePersistedDraft<{ zrobione: string[] }>("siec-sciezka-przejscia", { zrobione: [] })
  const przelacz = (id: string) =>
    setStan((p) => ({ zrobione: p.zrobione.includes(id) ? p.zrobione.filter((x) => x !== id) : [...p.zrobione, id] }))

  const zrobione = KROKI.filter((k) => stan.zrobione.includes(k.id))
  const nastepny = KROKI.find((k) => !stan.zrobione.includes(k.id))

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sciezka-przejscia" />
      <NaglowekEkranu tytul="Ścieżka przejścia">
        Sześć kroków od rachunku za prąd do decyzji o odejściu od sieci. Każdy krok otwiera ekrany, które go liczą — Twoje
        dane z nich przechodzą dalej automatycznie. Postęp zapisuje się na tym urządzeniu.
      </NaglowekEkranu>

      <PrzelacznikSegmentu value={segment} onChange={(s) => setSegment({ segment: s })} />

      <ol className="flex flex-col gap-3">
        {KROKI.map((k, i) => (
          <KrokZMedia key={k.id} numer={i + 1} tytul={k.tytul}>
            <p>{k.opis}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {k.ekrany[segment].map((e) => (
                <li key={e.href}>
                  <Link className="underline" href={e.href}>
                    {e.label} →
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <PoleCheckbox
                id={`sciezka-${k.id}`}
                checked={stan.zrobione.includes(k.id)}
                onChange={() => przelacz(k.id)}
                label="Zrobione"
              />
            </div>
          </KrokZMedia>
        ))}
      </ol>

      <WerdyktPanel
        poziom={nastepny ? "uwaga" : "ok"}
        etykieta={`Podsumowanie — ${zrobione.length} z ${KROKI.length} kroków`}
      >
        {nastepny ? (
          <p className="text-small">
            Następny krok: <strong>{nastepny.tytul}</strong>. Decyzję o odejściu od sieci podejmuj dopiero po przejściu
            wszystkich kroków — zwłaszcza zimy i ryzyk.
          </p>
        ) : (
          <p className="text-small">
            Wszystkie kroki przejrzane. Wynik porównania i warunki bezpieczeństwa są na ekranie scenariuszy — tam jest
            werdykt.
          </p>
        )}
        <ul className="mt-2 flex flex-col gap-1 text-small">
          {KROKI.map((k) => (
            <li key={k.id}>
              {stan.zrobione.includes(k.id) ? "✓" : "○"} {k.tytul}
            </li>
          ))}
        </ul>
        <button type="button" className="mt-3 w-fit rounded-md border px-3 py-1 text-small print:hidden" onClick={() => window.print()}>
          Drukuj / zapisz jako PDF
        </button>
      </WerdyktPanel>
    </main>
  )
}
