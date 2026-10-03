"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateFalownikThd } from "@/lib/core/modules/stress-test/falownik-thd/calculator"
import type { PunktKrzywejThd } from "@/lib/core/modules/stress-test/falownik-thd/input"
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

type Pola = "moc" | "obciazenie" | "thd"
type FormularzStan = Record<Pola, string> & {
  /** Table rows kept as parallel text arrays; a row counts only when both cells are filled. */
  tabelaThd: string[]
  tabelaK: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  moc: "",
  obciazenie: "",
  thd: "",
  tabelaThd: ["", "", ""],
  tabelaK: ["", "", ""],
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100
const r3 = (x: number) => Math.round(x * 1000) / 1000

export default function FalownikThdPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("falownik-thd", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const komorka = (kolumna: "tabelaThd" | "tabelaK", i: number, max?: number) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    ...(max === undefined ? {} : { max }),
    value: stan[kolumna][i] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setStan((prev) => ({ ...prev, [kolumna]: prev[kolumna].map((x, j) => (j === i ? e.target.value : x)) })),
  })
  const dodajWiersz = () => setStan((prev) => ({ ...prev, tabelaThd: [...prev.tabelaThd, ""], tabelaK: [...prev.tabelaK, ""] }))
  const usunWiersz = (i: number) =>
    setStan((prev) => ({ ...prev, tabelaThd: prev.tabelaThd.filter((_, j) => j !== i), tabelaK: prev.tabelaK.filter((_, j) => j !== i) }))

  const result = useMemo(() => {
    const tabela: PunktKrzywejThd[] = stan.tabelaThd.flatMap((thdTxt, i) => {
      const kTxt = stan.tabelaK[i] ?? ""
      return thdTxt !== "" && kTxt !== "" ? [{ thdPct: Number(thdTxt), wspolczynnik: Number(kTxt) }] : []
    })
    return calculateFalownikThd({
      mocZnamionowaKw: liczba(stan.moc),
      mocObciazeniaKw: liczba(stan.obciazenie),
      thdPct: stan.thd === "" ? null : Number(stan.thd),
      tabela,
    })
  }, [stan])
  const v = result.value
  const przekroczone = v.przekroczone

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/falownik-thd" />
      <NaglowekEkranu tytul={t("UI-M7-FTHD-TYTUL")} ekran="falownik-thd" wynik={result}>
        {t("UI-M7-FTHD-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-FTHD-FALOWNIK")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-FTHD-MOC-ZNAM")} unit="kW" {...pole("moc")} pomoc={<PomocPola ekran="falownik-thd" pole="mocZnamionowa" />} />
          <Pole label={t("UI-M7-FTHD-MOC-OBC")} unit="kW" {...pole("obciazenie")} pomoc={<PomocPola ekran="falownik-thd" pole="mocObciazenia" />} />
        </div>
        <Pole label={t("UI-M7-FTHD-THD")} unit="%" {...pole("thd")} pomoc={<PomocPola ekran="falownik-thd" pole="thd" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-FTHD-TABELA")}</legend>
        <p className="text-small text-muted-foreground">{t("UI-M7-FTHD-TABELA-NOTATKA")}</p>
        {stan.tabelaThd.map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
            <Pole label={t("UI-M7-FTHD-TABELA-THD")} unit="%" {...komorka("tabelaThd", i)} pomoc={<PomocPola ekran="falownik-thd" pole="tabelaThd" />} />
            <Pole label={t("UI-M7-FTHD-TABELA-K")} {...komorka("tabelaK", i, 1)} step="any" pomoc={<PomocPola ekran="falownik-thd" pole="tabelaK" />} />
            <Button type="button" variant="outline" onClick={() => usunWiersz(i)} aria-label={t("UI-M7-FTHD-TABELA-USUN")}>
              ×
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={dodajWiersz}>
          {t("UI-M7-FTHD-TABELA-DODAJ")}
        </Button>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-FTHD-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-FTHD-UZUPELNIJ")}</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-FTHD-W-POZA")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={przekroczone ? "blad" : "ok"} etykieta={t(przekroczone ? "UI-M7-FTHD-W-BLAD" : "UI-M7-FTHD-W-OK")}>
          <WynikGlowny>{t("UI-M7-FTHD-WYNIK", { kw: r2(v.dostepnaKw), thd: r1(Number(stan.thd)) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M7-FTHD-L-K", { k: r3(v.wspolczynnik), znam: r2(liczba(stan.moc)) })}</li>
            <li>{t("UI-M7-FTHD-L-OBC", { obc: r2(liczba(stan.obciazenie)) })}</li>
            {przekroczone ? (
              <li>{t("UI-M7-FTHD-L-BRAK", { kw: r2(-v.zapasKw) })}</li>
            ) : (
              <li>{t("UI-M7-FTHD-L-ZAPAS", { kw: r2(v.zapasKw), pct: v.zapasPct === null ? "—" : r1(v.zapasPct) })}</li>
            )}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/sprawnosc-inwertera-niskie-obciazenie" className="text-small underline">
        {t("UI-M7-FTHD-LINK")}
      </Link>
    </main>
  )
}
