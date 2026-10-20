"use client"

import { useMemo } from "react"
import { calculateCzasBalansowania } from "@/lib/core/modules/baterie/czas-balansowania/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pojemnoscAh: string
  rozjazdProc: string
  pradBalanseraA: string
  oknoGodzinDobe: string
}

const STAN_POCZATKOWY: FormularzStan = { pojemnoscAh: "", rozjazdProc: "", pradBalanseraA: "", oknoGodzinDobe: "" }

const liczba = (s: string) => (s === "" ? 0 : Number(s))

export default function CzasBalansowaniaPage() {
  const t = useTranslate()
  const { f1 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("czas-balansowania", STAN_POCZATKOWY)
  const { pojemnoscAh, rozjazdProc, pradBalanseraA, oknoGodzinDobe } = stan
  const setPole = (pole: keyof FormularzStan, wartosc: string) => setStan((prev) => ({ ...prev, [pole]: wartosc }))

  const result = useMemo(
    () =>
      calculateCzasBalansowania({
        pojemnoscAh: liczba(pojemnoscAh),
        rozjazdProc: liczba(rozjazdProc),
        pradBalanseraA: liczba(pradBalanseraA),
        oknoGodzinDobe: liczba(oknoGodzinDobe),
      }),
    [pojemnoscAh, rozjazdProc, pradBalanseraA, oknoGodzinDobe],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "VALID_WITH_WARNINGS" ? "uwaga" : result.status === "INVALID_INPUT" ? "blad" : null
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/czas-balansowania" />
      <NaglowekEkranu tytul={t("UI-CZB-TYTUL")} ekran="czas-balansowania" wynik={result}>
        {t("UI-CZB-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-CZB-POJEMNOSC")}
          unit="Ah"
          type="number"
          inputMode="decimal"
          min={0}
          value={pojemnoscAh}
          onChange={(e) => setPole("pojemnoscAh", e.target.value)}
          pomoc={<PomocPola ekran="czas-balansowania" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-CZB-ROZJAZD")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={rozjazdProc}
          onChange={(e) => setPole("rozjazdProc", e.target.value)}
          pomoc={<PomocPola ekran="czas-balansowania" pole="rozjazd" />}
        />
        <Pole
          label={t("UI-CZB-PRAD")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradBalanseraA}
          onChange={(e) => setPole("pradBalanseraA", e.target.value)}
          pomoc={<PomocPola ekran="czas-balansowania" pole="prad" />}
        />
        <Pole
          label={t("UI-CZB-OKNO")}
          unit={t("UI-CZB-GODZ-DOBE")}
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          value={oknoGodzinDobe}
          onChange={(e) => setPole("oknoGodzinDobe", e.target.value)}
          pomoc={<PomocPola ekran="czas-balansowania" pole="okno" />}
        />
      </div>

      {result.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">{t("UI-CZB-WYPELNIJ")}</p>}

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-CZB-WERDYKT-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}

      {poziom !== null && poziom !== "blad" && (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? t("UI-CZB-WERDYKT-OK") : t("UI-CZB-WERDYKT-UWAGA")}>
          <p className="text-small text-muted-foreground">{t("UI-CZB-CZAS-PRACY")}</p>
          <WynikGlowny>{f1(v.czasPracyH)} h</WynikGlowny>
          <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-small">
            <dt>{t("UI-CZB-AH")}</dt>
            <dd>{f1(v.ahDoPrzeniesienia)} Ah</dd>
            {v.dniOkna !== null && (
              <>
                <dt>{t("UI-CZB-DNI")}</dt>
                <dd>{f1(v.dniOkna)}</dd>
              </>
            )}
          </dl>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
