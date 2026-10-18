"use client"

import { useMemo } from "react"
import { calculateOplacalnoscMagazynu } from "@/lib/core/modules/baterie/oplacalnosc-magazynu/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  cenaBateriiZl: string
  pojemnoscUzytecznaKwh: string
  liczbaCykli: string
  sprawnoscPct: string
  kosztAlternatywyZlZaKwh: string
}

const STAN_POCZATKOWY: FormularzStan = {
  cenaBateriiZl: "",
  pojemnoscUzytecznaKwh: "",
  liczbaCykli: "",
  sprawnoscPct: "",
  kosztAlternatywyZlZaKwh: "",
}

const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("cenaBateriiZl", "kosztAlternatywyZlZaKwh")

export default function OplacalnoscMagazynuPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("oplacalnosc-magazynu", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const { cenaBateriiZl, pojemnoscUzytecznaKwh, liczbaCykli, sprawnoscPct, kosztAlternatywyZlZaKwh } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setCenaBateriiZl = (a: string | ((p: string) => string)) => setPole("cenaBateriiZl", a)
  const setPojemnoscUzytecznaKwh = (a: string | ((p: string) => string)) => setPole("pojemnoscUzytecznaKwh", a)
  const setLiczbaCykli = (a: string | ((p: string) => string)) => setPole("liczbaCykli", a)
  const setSprawnoscPct = (a: string | ((p: string) => string)) => setPole("sprawnoscPct", a)
  const setKosztAlternatywyZlZaKwh = (a: string | ((p: string) => string)) => setPole("kosztAlternatywyZlZaKwh", a)

  const result = useMemo(
    () =>
      calculateOplacalnoscMagazynu({
        cenaBateriiZl: cenaBateriiZl === "" ? 0 : Number(cenaBateriiZl),
        pojemnoscUzytecznaKwh: pojemnoscUzytecznaKwh === "" ? 0 : Number(pojemnoscUzytecznaKwh),
        liczbaCykli: liczbaCykli === "" ? 0 : Number(liczbaCykli),
        sprawnoscPct: sprawnoscPct === "" ? 0 : Number(sprawnoscPct),
        kosztAlternatywyZlZaKwh: kosztAlternatywyZlZaKwh === "" ? null : Number(kosztAlternatywyZlZaKwh),
      }),
    [cenaBateriiZl, pojemnoscUzytecznaKwh, liczbaCykli, sprawnoscPct, kosztAlternatywyZlZaKwh],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/oplacalnosc-magazynu" />
      <NaglowekEkranu
        tytul={t("UI-OPLMAG-ANALIZA-OPLACALNOSCI-MAGAZYN")}
        ekran="oplacalnosc-magazynu"
        wynik={result}
      >
        {t("UI-OPLMAG-BATERIA-SKARBONKA-ENERGII")}
      </NaglowekEkranu>

      <PrzeliczoneInfo info={info} />

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-OPLMAG-CENA-BATERII")}
          unit={t("UI-J-ZL")}
          type="number"
          inputMode="decimal"
          value={cenaBateriiZl}
          onChange={(e) => setCenaBateriiZl(e.target.value)}
          pomoc={<PomocPola ekran="oplacalnosc-magazynu" pole="cena" />}
        />
        <Pole
          label={t("UI-OPLMAG-POJEMNOSC-UZYTECZNA")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={pojemnoscUzytecznaKwh}
          onChange={(e) => setPojemnoscUzytecznaKwh(e.target.value)}
          pomoc={<PomocPola ekran="oplacalnosc-magazynu" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-OPLMAG-LICZBA-CYKLI-ZYCIA")}
          type="number"
          inputMode="numeric"
          value={liczbaCykli}
          onChange={(e) => setLiczbaCykli(e.target.value)}
          pomoc={<PomocPola ekran="oplacalnosc-magazynu" pole="cykle" />}
        />
        <Pole
          label={t("UI-OPLMAG-SPRAWNOSC-MAGAZYNU")}
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={sprawnoscPct}
          onChange={(e) => setSprawnoscPct(e.target.value)}
          pomoc={<PomocPola ekran="oplacalnosc-magazynu" pole="sprawnosc" />}
        />
        <Pole
          label={t("UI-OPLMAG-KOSZT-ALTERNATYWY-AGREGAT")}
          unit={t("UI-J-ZL-KWH")}
          type="number"
          inputMode="decimal"
          value={kosztAlternatywyZlZaKwh}
          onChange={(e) => setKosztAlternatywyZlZaKwh(e.target.value)}
          pomoc={<PomocPola ekran="oplacalnosc-magazynu" pole="alternatywa" />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-OPLMAG-WYPELNIJ-DANE-ZEBY")}
        </p>
      ) : result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-OPLMAG-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        poziom !== null &&
        poziom !== "blad" && (
          <WerdyktPanel poziom={poziom} etykieta={t("UI-OPLMAG-KOSZT-ENERGII-MAGAZYNU")}>
            <WynikGlowny>
              {t("UI-OPLMAG-KWH", { kosztZaKwh: formatLiczbe(result.value.kosztZaKwh, { maximumFractionDigits: 2 }) })}
            </WynikGlowny>
            <p className="mt-1 text-small">
              {t("UI-OPLMAG-CALKOWITA-ENERGIA-ODDANA", { energiaCalkowitaZyciaKwh: formatLiczbe(result.value.energiaCalkowitaZyciaKwh, { maximumFractionDigits: 0 }) })}
            </p>
            {result.warnings.map((w) => (
              <p key={w.code} className="mt-2 text-small">
                {w.message ?? t(w.i18nKey ?? w.code, w.params)}
              </p>
            ))}
            <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
          </WerdyktPanel>
        )
      )}
    </main>
  )
}
