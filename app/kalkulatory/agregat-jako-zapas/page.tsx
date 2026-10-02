"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBilansMiesieczny } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import { calculateAgregatPradotworczy } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PolaBezpieczenstwaAgregatu,
  naWejscieBezpieczenstwa,
  type BezpieczenstwoAgregatuStan,
} from "@/components/agregat/pola-bezpieczenstwa-agregatu"
import { liczba, poziomWerdyktu } from "@/components/siec/wspolne"
import { useDaneBilansu, wejscieBilansu } from "@/components/siec/pv-magazyn"
import { KLUCZE_MIESIECY } from "@/components/siec/zuzycie-miesieczne"
import { useZl } from "@/lib/waluta/use-waluta"
import { useTranslate } from "@/lib/i18n/language-context"

type Stan = BezpieczenstwoAgregatuStan & { moc: string; zuzycieLH: string; cena: string; bms: boolean }

const POCZATKOWY: Stan = { moc: "", zuzycieLH: "", cena: "", bms: false, miejsceAgregatu: "", podlaczenieAgregatu: "" }
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

/**
 * M14 — D6 „Agregat jako zapas” (pochodny, Wzorzec D). Echo of M2/E17 „Agregat prądotwórczy”
 * (the same engine and the same D48 safety block) fed with the worst-month shortfall of the
 * island balance (D4 installation without the grid) — no second generator model.
 */
export default function AgregatJakoZapasPage() {
  const t = useTranslate()
  const zl = useZl()
  const { zuzycie, pv, wczytano } = useDaneBilansu("dom")
  const [stan, setStan] = usePersistedDraft<Stan>("siec-agregat-dom", POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((p) => ({ ...p, ...z }))

  const bilans = useMemo(() => {
    const w = wejscieBilansu(pv, zuzycie, "wyspa")
    return w ? calculateBilansMiesieczny(w).value : null
  }, [pv, zuzycie])
  const m = bilans?.najgorszyMiesiac ?? null
  const deficyt = m === null || !bilans ? 0 : bilans.miesiace[m].niedoborKwh

  const result = useMemo(
    () =>
      calculateAgregatPradotworczy({
        deficytKwh: deficyt,
        mocAgregatuKw: liczba(stan.moc),
        sredniZuzycieLH: liczba(stan.zuzycieLH),
        cenaZaLitrZl: liczba(stan.cena),
        maWyjscieSterujaceBms: stan.bms,
        ...naWejscieBezpieczenstwa(stan),
      }),
    [deficyt, stan],
  )
  if (!wczytano) return <StanLadowania linie={6} />
  const poziom = poziomWerdyktu(result.status, result.warnings)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/agregat-jako-zapas" />
      <NaglowekEkranu tytul={t("UI-AGZ-TYTUL")} ekran="agregat-jako-zapas" wynik={result}>
        {t("UI-AGZ-OPIS")}
      </NaglowekEkranu>

      {!bilans ? (
        <StanPusty tytul={t("UI-AGZ-NAJPIERW")}>
          <Link className="underline" href="/kalkulatory/zima-bez-sieci">
            {t("UI-AGZ-L-ZIMA")}
          </Link>
        </StanPusty>
      ) : m === null ? (
        <WerdyktPanel poziom="ok" etykieta={t("UI-AGZ-BEZ-NIEDOBORU")}>
          <p className="text-small">{t("UI-AGZ-BEZ-NIEDOBORU-OPIS")}</p>
        </WerdyktPanel>
      ) : (
        <p className="text-small">
          {t("UI-AGZ-NAJGORSZY")} <strong>{t(KLUCZE_MIESIECY[m])}</strong>
          {t("UI-AGZ-BRAKUJE", { kwh: f1(deficyt) })}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-AGZ-MOC")}
          unit="kW"
          type="number"
          inputMode="decimal"
          value={stan.moc}
          onChange={(e) => ustaw({ moc: e.target.value })}
          pomoc={<PomocPola ekran="agregat-jako-zapas" pole="moc" />}
        />
        <Pole
          label={t("UI-AGZ-ZUZYCIE")}
          unit="l/h"
          type="number"
          inputMode="decimal"
          value={stan.zuzycieLH}
          onChange={(e) => ustaw({ zuzycieLH: e.target.value })}
          pomoc={<PomocPola ekran="agregat-jako-zapas" pole="paliwo" />}
        />
        <Pole
          label={t("UI-AGZ-CENA")}
          unit={t("UI-J-ZL-L")}
          type="number"
          inputMode="decimal"
          value={stan.cena}
          onChange={(e) => ustaw({ cena: e.target.value })}
          pomoc={<PomocPola ekran="agregat-jako-zapas" pole="cenaPaliwa" />}
        />
        <PoleCheckbox id="siec-agregat-bms" checked={stan.bms} onChange={(e) => ustaw({ bms: e.target.checked })} label={t("UI-AGZ-BMS")} />
        <PolaBezpieczenstwaAgregatu miejsceAgregatu={stan.miejsceAgregatu} podlaczenieAgregatu={stan.podlaczenieAgregatu} onChange={ustaw} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-AGZ-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        result.warnings.length > 0 && (
          <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta={t("UI-AGZ-BEZPIECZENSTWO")}>
            <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          </WerdyktPanel>
        )
      ) : (
        <WerdyktPanel poziom={poziom ?? "ok"} etykieta={t("UI-AGZ-W-MIESIACU", { miesiac: m === null ? "" : t(KLUCZE_MIESIECY[m]) })}>
          <WynikGlowny>{t("UI-AGZ-GODZINY", { h: f1(result.value.godzinyPracy) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-AGZ-PALIWO", { litry: f1(result.value.zuzyciePaliwaLitry), koszt: zl(result.value.kosztZl) })}{" "}
            <Link className="underline" href="/kalkulatory/przelacznik-siec-wyspa">
              {t("UI-AGZ-L-STYK")}
            </Link>
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
