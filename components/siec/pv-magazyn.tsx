"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBilansMiesieczny, type BilansMiesiecznyResult } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import type { BilansMiesiecznyInput, TrybBilansu } from "@/lib/core/modules/siec/bilans-miesieczny/input"
import type { Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { poziomWerdyktu } from "./wspolne"
import { POCZATKOWY_UZYSKU, SekcjaUzyskuPv, type StanUzysku, uzyskZeStanu } from "./uzysk-pv"
import {
  KLUCZE_MIESIECY,
  POCZATKOWY_ZUZYCIA,
  PolaZuzycia,
  type StanZuzycia,
  kluczZuzycia,
  useZuzycieMiesieczne,
  zuzycieZeSzkicu,
} from "./zuzycie-miesieczne"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * M14 — PV + storage of the transition part: D4 „Ile PV i magazynu” (dom) / F6 „PV w firmie i
 * autokonsumpcja” (firma). Owner of the draft `siec-pv-${segment}`; D5, D6 and D7/F8 read it.
 * Echo of the monthly balance (`siec/bilans-miesieczny`) — no own physics.
 */
export type StanPvMagazynu = {
  uzysk: StanUzysku
  mocPvKwp: string
  pojemnoscKwh: string
  autokonsumpcjaProcent: string
  sprawnoscProcent: string
}

export const POCZATKOWY_PV: StanPvMagazynu = {
  uzysk: POCZATKOWY_UZYSKU,
  mocPvKwp: "",
  pojemnoscKwh: "",
  autokonsumpcjaProcent: "",
  sprawnoscProcent: "",
}

export const kluczPv = (segment: Segment) => `siec-pv-${segment}`

const proc = (s: string) => (s === "" ? null : Number(s) / 100)

/** Balance input from the PV draft and 12 months of consumption; null when either is missing. */
export function wejscieBilansu(
  pv: StanPvMagazynu | null,
  zuzycie: number[] | null,
  tryb: TrybBilansu,
): BilansMiesiecznyInput | null {
  const uzysk = uzyskZeStanu(pv?.uzysk)
  if (!pv || !zuzycie || !uzysk) return null
  return {
    tryb,
    zuzycieMiesieczneKwh: zuzycie,
    uzyskMiesiecznyKwhNaKwp: uzysk,
    mocPvKwp: pv.mocPvKwp === "" ? 0 : Number(pv.mocPvKwp),
    autokonsumpcjaBezposrednia: proc(pv.autokonsumpcjaProcent),
    pojemnoscMagazynuKwh: pv.pojemnoscKwh === "" ? 0 : Number(pv.pojemnoscKwh),
    sprawnoscMagazynu: proc(pv.sprawnoscProcent),
  }
}

/** Echo read of D3/F6 + D4/F6 for the other transition screens. */
export function useDaneBilansu(segment: Segment) {
  const { zuzycie, wczytano: w1 } = useZuzycieMiesieczne(segment)
  const { dane: pv, wczytano: w2 } = useOdczytDraftu<StanPvMagazynu>(kluczPv(segment))
  return { zuzycie, pv, wczytano: w1 && w2 }
}

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export function TabelaBilansu({ wynik, tryb }: { wynik: BilansMiesiecznyResult; tryb: TrybBilansu }) {
  const t = useTranslate(true)
  return (
    <table className="mt-3 w-full text-small tabular-nums">
      <thead>
        <tr className="text-left text-muted-foreground">
          <th className="py-1 font-normal">{t("UI-PV-TH-MIES")}</th>
          <th className="py-1 text-right font-normal">{t("UI-PV-TH-ZUZYCIE")}</th>
          <th className="py-1 text-right font-normal">PV</th>
          <th className="py-1 text-right font-normal">{t("UI-PV-TH-Z-MAGAZYNU")}</th>
          <th className="py-1 text-right font-normal">{t(tryb === "siec" ? "UI-PV-TH-Z-SIECI" : "UI-PV-TH-BRAKUJE")}</th>
          <th className="py-1 text-right font-normal">{t(tryb === "siec" ? "UI-PV-TH-DO-SIECI" : "UI-PV-TH-STRATA")}</th>
        </tr>
      </thead>
      <tbody>
        {wynik.miesiace.map((m, i) => (
          <tr key={i} className="border-t">
            <td className="py-1">{t(KLUCZE_MIESIECY[i])}</td>
            <td className="py-1 text-right">{f0(m.zuzycieKwh)}</td>
            <td className="py-1 text-right">{f0(m.produkcjaKwh)}</td>
            <td className="py-1 text-right">{f0(m.zMagazynuKwh)}</td>
            <td className="py-1 text-right">{f0(m.niedoborKwh)}</td>
            <td className="py-1 text-right">{f0(m.nadwyzkaKwh)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function EkranPvMagazynu({ segment }: { segment: Segment }) {
  return segment === "firma" ? <PvFirmy /> : <PvDomu />
}

/** F6 owns the company's monthly consumption (there is no separate firm D3 screen). */
function PvFirmy() {
  const [stan, setStan] = usePersistedDraft<StanZuzycia>(kluczZuzycia("firma"), POCZATKOWY_ZUZYCIA)
  return (
    <>
      <PolaZuzycia stan={stan} onChange={setStan} />
      <PvIMagazyn segment="firma" zuzycie={zuzycieZeSzkicu(stan)} />
    </>
  )
}

function PvDomu() {
  const t = useTranslate(true)
  const { zuzycie, wczytano } = useZuzycieMiesieczne("dom")
  if (!wczytano) return <StanLadowania linie={6} />
  return (
    <>
      {!zuzycie && (
        <StanPusty tytul={t("UI-PV-NAJPIERW-ZUZYCIE")}>
          <Link className="underline" href="/kalkulatory/zuzycie-miesieczne">
            {t("UI-PV-LINK-ZUZYCIE")}
          </Link>
        </StanPusty>
      )}
      <PvIMagazyn segment="dom" zuzycie={zuzycie} />
    </>
  )
}

function PvIMagazyn({ segment, zuzycie }: { segment: Segment; zuzycie: number[] | null }) {
  const t = useTranslate(true)
  const firma = segment === "firma"
  const [pv, setPv] = usePersistedDraft<StanPvMagazynu>(kluczPv(segment), POCZATKOWY_PV)
  const ustaw = <K extends keyof StanPvMagazynu>(k: K, v: StanPvMagazynu[K]) => setPv((p) => ({ ...p, [k]: v }))

  const result = useMemo(() => {
    const wejscie = wejscieBilansu(pv, zuzycie, "siec")
    return wejscie ? calculateBilansMiesieczny(wejscie) : null
  }, [pv, zuzycie])

  return (
    <>
      <SekcjaUzyskuPv stan={pv.uzysk} onChange={(z) => ustaw("uzysk", { ...pv.uzysk, ...z })} />

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("UI-PV-INSTALACJA")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Pole
            label={t("UI-PV-MOC")}
            unit="kWp"
            type="number"
            inputMode="decimal"
            min={0}
            value={pv.mocPvKwp}
            onChange={(e) => ustaw("mocPvKwp", e.target.value)}
            pomoc={<PomocPola ekran="siec-pv-magazyn" pole="mocPv" />}
          />
          <Pole
            label={t("UI-PV-AUTOKONSUMPCJA")}
            unit="%"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            value={pv.autokonsumpcjaProcent}
            onChange={(e) => ustaw("autokonsumpcjaProcent", e.target.value)}
            pomoc={<PomocPola ekran="siec-pv-magazyn" pole="autokonsumpcja" />}
          />
          <Pole
            label={t("UI-PV-POJEMNOSC")}
            unit="kWh"
            type="number"
            inputMode="decimal"
            min={0}
            value={pv.pojemnoscKwh}
            onChange={(e) => ustaw("pojemnoscKwh", e.target.value)}
            pomoc={<PomocPola ekran="siec-pv-magazyn" pole="magazyn" />}
          />
          <Pole
            label={t("UI-PV-SPRAWNOSC")}
            unit="%"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            value={pv.sprawnoscProcent}
            onChange={(e) => ustaw("sprawnoscProcent", e.target.value)}
            pomoc={<PomocPola ekran="siec-pv-magazyn" pole="sprawnosc" />}
          />
        </div>
        {firma && (
          <p className="text-small text-muted-foreground">
            {t("UI-PV-OPLACALNOSC")}{" "}
            <Link className="underline" href="/kalkulatory/magazyn-firmy">
              {t("UI-PV-LINK-BESS")}
            </Link>
          </p>
        )}
      </section>

      {!result ? (
        <StanPusty tytul={t("UI-PV-UZUPELNIJ")} />
      ) : result.status === "INVALID_INPUT" || result.value === null ? (
        <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta={t(result.status === "INVALID_INPUT" ? "UI-PV-SPRAWDZ-DANE" : "UI-PV-BRAKUJE-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          {result.status === "INCOMPLETE" && <p className="text-small">{t("UI-PV-WPISZ-AUTO")}</p>}
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"} etykieta={t("UI-PV-BILANS")}>
          <WynikGlowny>{t("UI-PV-POKRYCIE", { p: Math.round(result.value.pokrycieWlasne * 100) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-PV-PODSUMOWANIE", {
              zSieci: f0(result.value.niedoborRokKwh),
              doSieci: f0(result.value.nadwyzkaRokKwh),
              produkcja: f0(result.value.produkcjaRokKwh),
              zuzycie: f0(result.value.zuzycieRokKwh),
            })}
          </p>
          <TabelaBilansu wynik={result.value} tryb="siec" />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </>
  )
}
