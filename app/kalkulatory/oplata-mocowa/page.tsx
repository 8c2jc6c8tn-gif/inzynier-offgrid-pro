"use client"

import { useMemo } from "react"
import { calculateOplataMocowa } from "@/lib/core/modules/siec/oplata-mocowa/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, nadpisanie, poziomWerdyktu, zl } from "@/components/siec/wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

type Stan = { roczna: string; wGodzinach: string; przesuniecie: string; stawka: string }

export default function OplataMocowaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("siec-oplata-mocowa", { roczna: "", wGodzinach: "", przesuniecie: "0", stawka: "" })
  const ustaw = <K extends keyof Stan>(pole: K, v: string) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateOplataMocowa({
        dataRozliczenia: "2026-12-31",
        energiaRocznaKwh: liczba(stan.roczna),
        energiaWGodzinachKwh: liczbaLubNull(stan.wGodzinach),
        przesuniecieProcent: liczba(stan.przesuniecie),
        stawkaWlasnaZlKwh: nadpisanie(stan.stawka),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oplata-mocowa" />
      <NaglowekEkranu tytul={t("UI-OPLMOC-OPLATA-MOCOWA-PRZESUNIECIE")} ekran="oplata-mocowa" wynik={result}>
        {t("UI-OPLMOC-FIRMIE-OPLATA-MOCOWA")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-OPLMOC-ENERGIA-POBRANA-ROKU")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={stan.roczna}
          onChange={(e) => ustaw("roczna", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="energiaRok" />}
        />
        <Pole
          label={t("UI-OPLMOC-TYM-DNI-ROBOCZE")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={stan.wGodzinach}
          onChange={(e) => ustaw("wGodzinach", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="energiaSzczyt" />}
        />
        <Pole
          label={t("UI-OPLMOC-ILE-TEGO-PRZESUNIESZ")}
          unit="%"
          type="number"
          inputMode="decimal"
          value={stan.przesuniecie}
          onChange={(e) => ustaw("przesuniecie", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="przesuniecie" />}
        />
        <Pole
          label={t("UI-OPLMOC-STAWKA-FAKTURY-OPCJONALNIE")}
          unit={t("UI-J-ZL-KWH")}
          type="number"
          inputMode="decimal"
          value={stan.stawka}
          onChange={(e) => ustaw("stawka", e.target.value)}
          pomoc={<PomocPola ekran="oplata-mocowa" pole="stawka" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-OPLMOC-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-OPLMOC-WPISZ-ENERGIE-ROCZNA")}</p>
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta={t("UI-OPLMOC-OPLATA-MOCOWA-ROKU")}>
          <WynikGlowny>{t("UI-OPLMOC-NETTO-ROK", { oplataRokZl: zl(v.oplataRokZl) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-OPLMOC-ENERGII-POBIERASZ-GODZINACH", { udzialProcent: v.udzialProcent.toLocaleString("pl-PL", { maximumFractionDigits: 1 }), oplataPoPrzesunieciuZl: zl(v.oplataPoPrzesunieciuZl), oszczednoscRokZl: zl(v.oszczednoscRokZl) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
