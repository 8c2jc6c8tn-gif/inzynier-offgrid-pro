"use client"

import { useMemo } from "react"
import { calculateMocBierna } from "@/lib/core/modules/siec/moc-bierna/calculator"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, poziomWerdyktu, stawkiDoPomocy } from "@/components/siec/wspolne"
import { useZl } from "@/lib/waluta/use-waluta"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type Stan = {
  tgFi: string
  tgFi0: string
  energiaCzynna: string
  cRk: string
  pojemnosciowa: string
  moc: string
  tgFiCel: string
  koszt: string
}

const TG_FI0 = String(DANE_ROZLICZEN.mocBierna.tgFi0Domyslny.okresy[0].wartosc)

export default function MocBiernaPage() {
  const t = useTranslate(true)
  const formatLiczbe = useFormatLiczby()
  const zl = useZl()
  const [stan, setStan] = usePersistedDraft<Stan>("siec-moc-bierna", {
    tgFi: "",
    tgFi0: TG_FI0,
    energiaCzynna: "",
    cRk: "",
    pojemnosciowa: "",
    moc: "",
    tgFiCel: "",
    koszt: "",
  })
  const ustaw = <K extends keyof Stan>(pole: K, v: string) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateMocBierna({
        tgFi: liczbaLubNull(stan.tgFi),
        tgFi0: liczba(stan.tgFi0),
        energiaCzynnaKwh: liczba(stan.energiaCzynna),
        cRkZlKwh: liczbaLubNull(stan.cRk),
        energiaPojemnosciowaKvarh: liczba(stan.pojemnosciowa),
        mocCzynnaSredniaKw: liczba(stan.moc),
        tgFiCel: liczbaLubNull(stan.tgFiCel),
        kosztBateriiZl: liczba(stan.koszt),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/moc-bierna" />
      <NaglowekEkranu
        tytul={t("UI-MOCBIE-MOC-BIERNA-OPLATA")}
        ekran="moc-bierna"
        wynik={result}
        parametry={stawkiDoPomocy()}
      >
        {t("UI-MOCBIE-ILE-FIRMA-PLACI")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <p className="text-small text-muted-foreground">
          {t("UI-MOCBIE-NAJPIERW-SPRAWDZ-FAKTURZE")}
        </p>
        <Pole
          label={t("UI-MOCBIE-ZMIERZONY-SREDNI")}
          type="number"
          inputMode="decimal"
          value={stan.tgFi}
          onChange={(e) => ustaw("tgFi", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="tgPhi" />}
        />
        <Pole
          label={t("UI-MOCBIE-UMOWY")}
          type="number"
          inputMode="decimal"
          value={stan.tgFi0}
          onChange={(e) => ustaw("tgFi0", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="tgPhi0" />}
        />
        <Pole
          label={t("UI-MOCBIE-ENERGIA-CZYNNA-POBRANA")}
          unit={t("UI-J-KWH-ROK")}
          type="number"
          inputMode="decimal"
          value={stan.energiaCzynna}
          onChange={(e) => ustaw("energiaCzynna", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="energiaCzynna" />}
        />
        <Pole
          label={t("UI-MOCBIE-CENA")}
          unit={t("UI-J-ZL-KWH")}
          type="number"
          inputMode="decimal"
          value={stan.cRk}
          onChange={(e) => ustaw("cRk", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="crk" />}
        />
        <Pole
          label={t("UI-MOCBIE-ENERGIA-BIERNA-POJEMNOSCIOWA")}
          unit={t("UI-MOCBIE-KVARH-ROK")}
          type="number"
          inputMode="decimal"
          value={stan.pojemnosciowa}
          onChange={(e) => ustaw("pojemnosciowa", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="pojemnosciowa" />}
        />
        <h2 className="text-base font-medium">{t("UI-MOCBIE-KOMPENSACJA-OPCJONALNIE")}</h2>
        <Pole
          label={t("UI-MOCBIE-SREDNIA-MOC-CZYNNA")}
          unit="kW"
          type="number"
          inputMode="decimal"
          value={stan.moc}
          onChange={(e) => ustaw("moc", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="mocSrednia" />}
        />
        <Pole
          label={t("UI-MOCBIE-DOCELOWY")}
          type="number"
          inputMode="decimal"
          value={stan.tgFiCel}
          onChange={(e) => ustaw("tgFiCel", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="tgCel" />}
        />
        <Pole
          label={t("UI-MOCBIE-KOSZT-BATERII-KONDENSATOROW")}
          unit={t("UI-J-ZL")}
          type="number"
          inputMode="decimal"
          value={stan.koszt}
          onChange={(e) => ustaw("koszt", e.target.value)}
          pomoc={<PomocPola ekran="moc-bierna" pole="kosztBaterii" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-MOCBIE-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : stan.tgFi === "" ? (
        <p className="text-small text-muted-foreground">{t("UI-MOCBIE-WPISZ-ZEBY-ZOBACZYC")}</p>
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta={t("UI-MOCBIE-OPLATA-ENERGIE-BIERNA")}>
          <WynikGlowny>
            {v.oplataRazemZl !== null ? t("UI-MOCBIE-NETTO-ROK", { oplataRazemZl: zl(v.oplataRazemZl) }) : t("UI-MOCBIE-CZYNNIK", { czynnik: formatLiczbe(v.czynnik, { maximumFractionDigits: 4 }) })}
          </WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-MOCBIE-CZYNNIK-NADWYZKI", { czynnik: formatLiczbe(v.czynnik, { maximumFractionDigits: 4 }) })}
            {v.oplataIndukcyjnaZl !== null && <> {t("UI-MOCBIE-INDUKCYJNA-POJEMNOSCIOWA", { oplataIndukcyjnaZl: zl(v.oplataIndukcyjnaZl), p: zl(v.oplataPojemnosciowaZl ?? 0) })}</>}
          </p>
          {v.mocKompensacjiKvar !== null && (
            <p className="mt-1 text-small">
              {t("UI-MOCBIE-POTRZEBNA-MOC-KOMPENSACJI", { mocKompensacjiKvar: formatLiczbe(v.mocKompensacjiKvar, { maximumFractionDigits: 1 }) })}
              {v.zwrotLat !== null && <>{t("UI-MOCBIE-ZWROT-BATERII-LAT", { zwrotLat: formatLiczbe(v.zwrotLat, { maximumFractionDigits: 1 }) })}</>}.
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
