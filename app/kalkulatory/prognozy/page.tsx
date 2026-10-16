"use client"

import { useMemo } from "react"
import { calculatePrognozy, KROK_PROBKOWANIA_H } from "@/lib/core/modules/ai/prognozy/calculator"
import { SAMPLE_PROGNOZA_24H } from "@/lib/core/modules/ai/prognozy/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

const GODZINY = Array.from({ length: 24 / KROK_PROBKOWANIA_H }, (_, i) => i * KROK_PROBKOWANIA_H)
type Stan = { produkcja: string[]; zuzycie: string[] }
const STAN_POCZATKOWY: Stan = { produkcja: GODZINY.map(() => ""), zuzycie: GODZINY.map(() => "") }
const godzinaTekst = (g: number) => `${String(g % 24).padStart(2, "0")}:00`

// Client Component: screen text goes through useTranslate() (D58) — the language lives in the
// browser (docs/standards/17-i18n.md 17.4, offline-first correction), so the server cannot render it.
// The points are typed by the user (empty = not entered, never a zero); demo data only on request (the button).
export default function PrognozyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("prognozy", STAN_POCZATKOWY)
  const ustaw = (klucz: keyof Stan, i: number, wartosc: string) => setStan((s) => ({ ...s, [klucz]: s[klucz].map((x, j) => (j === i ? wartosc : x)) }))
  const wstawPrzyklad = () =>
    setStan({
      produkcja: GODZINY.map((g) => String(SAMPLE_PROGNOZA_24H.find((p) => p.godzina === g)?.produkcjaKw ?? 0)),
      zuzycie: GODZINY.map((g) => String(SAMPLE_PROGNOZA_24H.find((p) => p.godzina === g)?.zuzycieKw ?? 0)),
    })

  const punkty = useMemo(() => {
    const wartosci = GODZINY.map((godzina, i) => ({ godzina, produkcjaKw: liczba(stan.produkcja[i] ?? "") ?? null, zuzycieKw: liczba(stan.zuzycie[i] ?? "") ?? null }))
    return wartosci.every((p) => p.produkcjaKw !== null && p.zuzycieKw !== null) ? wartosci.map((p) => ({ godzina: p.godzina, produkcjaKw: p.produkcjaKw!, zuzycieKw: p.zuzycieKw! })) : null
  }, [stan])
  const result = useMemo(() => calculatePrognozy(punkty ?? [], "wpisane"), [punkty])
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/prognozy" />
      <NaglowekEkranu tytul={t("UI-PRO-PROGNOZY")} ekran="prognozy" wynik={result}>
        {t("UI-PRO-POGODA-SYSTEMU-ENERGETYCZNEG")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <p className="text-small text-muted-foreground">{t("UI-PRO-WPISZ")}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={wstawPrzyklad} className="min-h-11 rounded-md border px-4 text-small font-medium hover:bg-muted">
            {t("UI-PRO-WSTAW-PRZYKLAD")}
          </button>
          <button type="button" onClick={() => setStan(STAN_POCZATKOWY)} className="min-h-11 rounded-md border px-4 text-small font-medium hover:bg-muted">
            {t("UI-PRO-WYCZYSC")}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GODZINY.map((g, i) => (
            <fieldset key={g} className="grid grid-cols-2 gap-2 rounded-md border p-2">
              <legend className="px-1 text-small font-medium">{`${godzinaTekst(g)}–${godzinaTekst(g + KROK_PROBKOWANIA_H)}`}</legend>
              <Pole id={`pro-prod-${i}`} label={t("UI-PRO-PRODUKCJA")} type="number" inputMode="decimal" min={0} value={stan.produkcja[i] ?? ""} onChange={(e) => ustaw("produkcja", i, e.target.value)} pomoc={<PomocPola ekran="prognozy" pole="produkcja" />} />
              <Pole id={`pro-zuz-${i}`} label={t("UI-PRO-ZUZYCIE")} type="number" inputMode="decimal" min={0} value={stan.zuzycie[i] ?? ""} onChange={(e) => ustaw("zuzycie", i, e.target.value)} pomoc={<PomocPola ekran="prognozy" pole="zuzycie" />} />
            </fieldset>
          ))}
        </div>
      </section>

      {punkty === null && <p className="text-small text-muted-foreground">{t("UI-PRO-UZUPELNIJ")}</p>}
      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PRO-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}
      {result.status === "VALID" && (
        <WerdyktPanel poziom="ok">
          <p className="mt-1 text-h1 font-semibold">{t("UI-PRO-BILANS-DOBOWY-KWH", { bilansKwh: v.bilansKwh.toFixed(1) })}</p>
          <p className="mt-1 text-small">
            {t("UI-PRO-PRODUKCJA-KWH-ZUZYCIE", { produkcjaLacznaKwh: v.produkcjaLacznaKwh.toFixed(1), zuzycieLaczneKwh: v.zuzycieLaczneKwh.toFixed(1), godzinaSzczytuZuzycia: v.godzinaSzczytuZuzycia })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
