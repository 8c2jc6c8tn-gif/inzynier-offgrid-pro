"use client"

import Link from "next/link"
import { useEffect, useMemo } from "react"
import { calculatePlanPoprawy } from "@/lib/core/modules/ogrzewanie/plan-poprawy-efektywnosci/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { RozbicieKwot, useSymbolWaluty } from "@/components/waluta-pola"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

/** `id` — each row's cost keeps its own currency (`dzialania.<id>.koszt`); drafts saved before 3.55.0 get it on load. */
type Wiersz = { id: string; nazwa: string; oszczednosc: string; koszt: string }
type Stan = { dzialania: Wiersz[]; cop: string; cena: string }

const nowy = (id: string = crypto.randomUUID()): Wiersz => ({ id, nazwa: "", oszczednosc: "", koszt: "" })
const STAN_POCZATKOWY: Stan = { dzialania: [nowy("d1"), nowy("d2")], cop: "", cena: "" }
const n = (s: string) => liczba(s) ?? 0
const r0 = (x: number) => Math.round(x)
const r1 = (x: number) => Math.round(x * 10) / 10

/** Moduł 6, Część 2C — dawne 5.68: rekomendacje poprawy efektywności posortowane po zwrocie (Wzorzec G). */
/** Money fields: cost of each action and the heat price. */
const KWOTY = ["dzialania.*.koszt", "cena"]

export default function PlanPoprawyEfektywnosciPage() {
  const t = useTranslate()
  const symbol = useSymbolWaluty()
  const [stan, setStan, waluty, wczytano] = usePersistedDraft<Stan>("plan-poprawy-efektywnosci", STAN_POCZATKOWY, { kwoty: KWOTY })
  // Rows saved before 3.55.0 have no id: give them one, so each row's cost keeps its own currency.
  useEffect(() => {
    if (wczytano && stan.dzialania.some((d) => !d.id))
      setStan((s) => ({ ...s, dzialania: s.dzialania.map((d) => (d.id ? d : { ...d, id: crypto.randomUUID() })) }))
  }, [wczytano, stan.dzialania, setStan])
  // Amounts typed in another currency are converted to the working currency (NBP) for the calculator.
  const r = waluty.stanRoboczy
  const wCeny = waluty.pole("cena")
  const ustawWiersz = (i: number, klucz: keyof Wiersz, wartosc: string) =>
    setStan((s) => ({ ...s, dzialania: s.dzialania.map((d, j) => (j === i ? { ...d, [klucz]: wartosc } : d)) }))
  const liczbowe = { type: "number", inputMode: "decimal" as const, min: 0 }

  const result = useMemo(
    () =>
      calculatePlanPoprawy({
        dzialania: r.dzialania.map((d, i) => ({
          nazwa: d.nazwa.trim() || t("UI-M6D-PLAN-DZIALANIE", { n: i + 1 }),
          oszczednoscCieplaKwh: n(d.oszczednosc),
          kosztZl: n(d.koszt),
        })),
        cop: n(r.cop),
        cenaZlKwh: n(r.cena),
      }),
    [r, t],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/plan-poprawy-efektywnosci" />
      <NaglowekEkranu tytul={t("UI-M6D-PLAN-TYTUL")} ekran="plan-poprawy-efektywnosci" wynik={result}>
        {t("UI-M6D-PLAN-OPIS")}
      </NaglowekEkranu>

      {stan.dzialania.map((d, i) => {
        const wKosztu = waluty.pole(`dzialania.${d.id}.koszt`)
        return (
          <fieldset key={d.id || i} className="flex flex-col gap-3 rounded-md border p-3">
            <legend className="px-1 text-small font-medium">{t("UI-M6D-PLAN-DZIALANIE", { n: i + 1 })}</legend>
            <Pole
              label={t("UI-M6D-PLAN-NAZWA")}
              type="text"
              value={d.nazwa}
              onChange={(e) => ustawWiersz(i, "nazwa", e.target.value)}
              pomoc={<PomocPola ekran="plan-poprawy-efektywnosci" pole="nazwa" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Pole
                label={t("UI-M6D-PLAN-OSZCZEDNOSC")}
                unit={t("UI-J-KWH-ROK")}
                {...liczbowe}
                value={d.oszczednosc}
                onChange={(e) => ustawWiersz(i, "oszczednosc", e.target.value)}
                pomoc={<PomocPola ekran="plan-poprawy-efektywnosci" pole="oszczednosc" />}
              />
              <Pole
                label={t("UI-M6D-PLAN-KOSZT")}
                unit={t("UI-J-ZL", { waluta: symbol(wKosztu.kod) })}
                {...liczbowe}
                value={d.koszt}
                waluta={wKosztu}
                onChange={(e) => ustawWiersz(i, "koszt", e.target.value)}
                pomoc={<PomocPola ekran="plan-poprawy-efektywnosci" pole="koszt" />}
              />
            </div>
            {stan.dzialania.length > 1 && (
              <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, dzialania: s.dzialania.filter((_, j) => j !== i) }))}>
                {t("UI-M6D-PLAN-USUN")}
              </Button>
            )}
          </fieldset>
        )
      })}
      <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ ...s, dzialania: [...s.dzialania, nowy()] }))}>
        {t("UI-M6D-PLAN-DODAJ")}
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Pole
          label={t("UI-M6D-PLAN-COP")}
          {...liczbowe}
          value={stan.cop}
          onChange={(e) => setStan((s) => ({ ...s, cop: e.target.value }))}
          pomoc={<PomocPola ekran="plan-poprawy-efektywnosci" pole="cop" />}
        />
        <Pole
          label={t("UI-M6D-PLAN-CENA")}
          unit={t("UI-J-ZL-KWH", { waluta: symbol(wCeny.kod) })}
          {...liczbowe}
          value={stan.cena}
          waluta={wCeny}
          onChange={(e) => setStan((s) => ({ ...s, cena: e.target.value }))}
          pomoc={<PomocPola ekran="plan-poprawy-efektywnosci" pole="cena" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-PLAN-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6D-PLAN-W-OK")}>
          <WynikGlowny>{t("UI-M6D-PLAN-WYNIK", { nazwa: v.plan[0].nazwa })}</WynikGlowny>
          <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-small">
            {v.plan.map((p) => (
              <li key={p.indeks}>
                {t("UI-M6D-PLAN-POZYCJA", { nazwa: p.nazwa, cieplo: r0(p.oszczednoscCieplaKwh), prad: r0(p.oszczednoscPraduKwh) })}
                {p.oszczednoscZlRok !== null && <> {t("UI-M6D-PLAN-ZL", { zl: r0(p.oszczednoscZlRok) })}</>}
                {p.zwrotLat !== null && <> {t("UI-M6D-PLAN-ZWROT", { lat: r1(p.zwrotLat) })}</>}
              </li>
            ))}
          </ol>
          <RozbicieKwot rozbicie={waluty.rozbicie} />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/wplyw-czynnika" className="text-small underline">
        {t("UI-M6D-PLAN-LINK-2D")}
      </Link>
    </main>
  )
}
