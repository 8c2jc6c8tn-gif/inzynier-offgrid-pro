"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateTurbinaWiatrowa } from "@/lib/core/modules/stress-test/turbina-wiatrowa/calculator"
import type { PunktKrzywejMocy } from "@/lib/core/modules/stress-test/turbina-wiatrowa/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola = "srednia" | "wylaczenie" | "wspolczynnik"
type FormularzStan = Record<Pola, string> & {
  /** Curve rows kept as parallel text arrays; a row counts only when both cells are filled. */
  krzywaV: string[]
  krzywaP: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  srednia: "",
  wylaczenie: "",
  wspolczynnik: "",
  krzywaV: ["", "", ""],
  krzywaP: ["", "", ""],
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function TurbinaWiatrowaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("turbina-wiatrowa", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const komorka = (kolumna: "krzywaV" | "krzywaP", i: number) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[kolumna][i] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setStan((prev) => ({ ...prev, [kolumna]: prev[kolumna].map((x, j) => (j === i ? e.target.value : x)) })),
  })
  const dodajWiersz = () => setStan((prev) => ({ ...prev, krzywaV: [...prev.krzywaV, ""], krzywaP: [...prev.krzywaP, ""] }))
  const usunWiersz = (i: number) =>
    setStan((prev) => ({ ...prev, krzywaV: prev.krzywaV.filter((_, j) => j !== i), krzywaP: prev.krzywaP.filter((_, j) => j !== i) }))

  const result = useMemo(() => {
    const krzywa: PunktKrzywejMocy[] = stan.krzywaV.flatMap((vTxt, i) => {
      const pTxt = stan.krzywaP[i] ?? ""
      return vTxt !== "" && pTxt !== "" ? [{ predkoscMs: Number(vTxt), mocKw: Number(pTxt) }] : []
    })
    return calculateTurbinaWiatrowa({
      sredniaPredkoscMs: liczba(stan.srednia),
      krzywa,
      predkoscWylaczeniaMs: liczba(stan.wylaczenie),
      wspolczynnikDostepnosciStrat: stan.wspolczynnik === "" ? null : Number(stan.wspolczynnik),
    })
  }, [stan])
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/turbina-wiatrowa" />
      <NaglowekEkranu tytul={t("UI-M7-TURB-TYTUL")} ekran="turbina-wiatrowa" wynik={result}>
        {t("UI-M7-TURB-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-TURB-WIATR")}</legend>
        <Pole label={t("UI-M7-TURB-SREDNIA")} unit="m/s" {...pole("srednia")} step="any" pomoc={<PomocPola ekran="turbina-wiatrowa" pole="sredniaPredkosc" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-TURB-WYLACZENIE")} unit="m/s" {...pole("wylaczenie")} step="any" pomoc={<PomocPola ekran="turbina-wiatrowa" pole="predkoscWylaczenia" />} />
          <Pole label={t("UI-M7-TURB-WSPOLCZYNNIK")} {...pole("wspolczynnik")} max={1} step="any" pomoc={<PomocPola ekran="turbina-wiatrowa" pole="wspolczynnikDostepnosci" />} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-TURB-KRZYWA")}</legend>
        <p className="text-small text-muted-foreground">{t("UI-M7-TURB-KRZYWA-NOTATKA")}</p>
        {stan.krzywaV.map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
            <Pole label={t("UI-M7-TURB-KRZYWA-V")} unit="m/s" {...komorka("krzywaV", i)} step="any" pomoc={<PomocPola ekran="turbina-wiatrowa" pole="krzywaV" />} />
            <Pole label={t("UI-M7-TURB-KRZYWA-P")} unit="kW" {...komorka("krzywaP", i)} step="any" pomoc={<PomocPola ekran="turbina-wiatrowa" pole="krzywaP" />} />
            <Button type="button" variant="outline" onClick={() => usunWiersz(i)} aria-label={t("UI-M7-TURB-USUN")}>
              ×
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={dodajWiersz}>
          {t("UI-M7-TURB-DODAJ")}
        </Button>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-TURB-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-TURB-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M7-TURB-W-SZACUNEK")}>
          <WynikGlowny>{t("UI-M7-TURB-WYNIK", { e: r1(v.energiaDobaKwh) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M7-TURB-L-SREDNIA", { p: r2(v.sredniaMocKw) })}</li>
            <li>{t("UI-M7-TURB-L-CALKA", { c: r2(v.calkaKw) })}</li>
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/deficyty-miesieczne" className="text-small underline">
        {t("UI-M7-TURB-LINK")}
      </Link>
    </main>
  )
}
