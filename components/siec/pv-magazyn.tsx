"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateBilansMiesieczny, type BilansMiesiecznyResult } from "@/lib/core/modules/siec/bilans-miesieczny/calculator"
import type { BilansMiesiecznyInput, TrybBilansu } from "@/lib/core/modules/siec/bilans-miesieczny/input"
import type { Segment } from "@/lib/core/modules/siec/rachunek-za-prad/input"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { StanLadowania, StanPusty } from "@/components/ui/stany"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { poziomWerdyktu } from "./wspolne"
import { POCZATKOWY_UZYSKU, SekcjaUzyskuPv, type StanUzysku, uzyskZeStanu } from "./uzysk-pv"
import {
  MIESIACE_KROTKO,
  POCZATKOWY_ZUZYCIA,
  PolaZuzycia,
  type StanZuzycia,
  kluczZuzycia,
  useZuzycieMiesieczne,
  zuzycieZeSzkicu,
} from "./zuzycie-miesieczne"

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
  return (
    <table className="mt-3 w-full text-small tabular-nums">
      <thead>
        <tr className="text-left text-muted-foreground">
          <th className="py-1 font-normal">Mies.</th>
          <th className="py-1 text-right font-normal">Zużycie</th>
          <th className="py-1 text-right font-normal">PV</th>
          <th className="py-1 text-right font-normal">Z magazynu</th>
          <th className="py-1 text-right font-normal">{tryb === "siec" ? "Z sieci" : "Brakuje"}</th>
          <th className="py-1 text-right font-normal">{tryb === "siec" ? "Do sieci" : "Strata"}</th>
        </tr>
      </thead>
      <tbody>
        {wynik.miesiace.map((m, i) => (
          <tr key={i} className="border-t">
            <td className="py-1">{MIESIACE_KROTKO[i]}</td>
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
  const { zuzycie, wczytano } = useZuzycieMiesieczne("dom")
  if (!wczytano) return <StanLadowania linie={6} />
  return (
    <>
      {!zuzycie && (
        <StanPusty tytul="Najpierw wpisz zużycie z 12 miesięcy">
          <Link className="underline" href="/kalkulatory/zuzycie-miesieczne">
            Moje zużycie miesięcznie →
          </Link>
        </StanPusty>
      )}
      <PvIMagazyn segment="dom" zuzycie={zuzycie} />
    </>
  )
}

function PvIMagazyn({ segment, zuzycie }: { segment: Segment; zuzycie: number[] | null }) {
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
        <h2 className="font-semibold">Instalacja</h2>
        <div className="grid grid-cols-2 gap-3">
          <Pole label="Moc PV" unit="kWp" type="number" inputMode="decimal" min={0} value={pv.mocPvKwp} onChange={(e) => ustaw("mocPvKwp", e.target.value)} />
          <Pole
            label="Autokonsumpcja bezpośrednia"
            unit="%"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            value={pv.autokonsumpcjaProcent}
            onChange={(e) => ustaw("autokonsumpcjaProcent", e.target.value)}
            hint="Jaka część produkcji PV jest zużywana od razu. Twoja wartość — typowe profile OSD nie są jeszcze w aplikacji."
          />
          <Pole
            label="Magazyn — pojemność użyteczna"
            unit="kWh"
            type="number"
            inputMode="decimal"
            min={0}
            value={pv.pojemnoscKwh}
            onChange={(e) => ustaw("pojemnoscKwh", e.target.value)}
            hint="0 lub puste = bez magazynu. Użyteczna, czyli po DoD (Moduł 4)."
          />
          <Pole
            label="Sprawność cyklu magazynu"
            unit="%"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            value={pv.sprawnoscProcent}
            onChange={(e) => ustaw("sprawnoscProcent", e.target.value)}
            hint="Z karty katalogowej magazynu i falownika."
          />
        </div>
        {firma && (
          <p className="text-small text-muted-foreground">
            Opłacalność magazynu z Twoich cen:{" "}
            <Link className="underline" href="/kalkulatory/magazyn-firmy">
              Magazyn (BESS) — strumienie korzyści →
            </Link>
          </p>
        )}
      </section>

      {!result ? (
        <StanPusty tytul="Uzupełnij zużycie i uzysk PV — wtedy pojawi się bilans miesięczny." />
      ) : result.status === "INVALID_INPUT" || result.value === null ? (
        <WerdyktPanel poziom={result.status === "INVALID_INPUT" ? "blad" : "uwaga"} etykieta={result.status === "INVALID_INPUT" ? "Sprawdź wpisane dane" : "Brakuje danych"}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
          {result.status === "INCOMPLETE" && <p className="text-small">Przy PV wpisz autokonsumpcję, przy magazynie — jego sprawność.</p>}
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziomWerdyktu(result.status, result.warnings) ?? "ok"} etykieta="Bilans z siecią">
          <WynikGlowny>{Math.round(result.value.pokrycieWlasne * 100)}% zużycia z własnej energii</WynikGlowny>
          <p className="mt-1 text-small">
            Z sieci {f0(result.value.niedoborRokKwh)} kWh/rok, do sieci {f0(result.value.nadwyzkaRokKwh)} kWh/rok. Produkcja PV{" "}
            {f0(result.value.produkcjaRokKwh)} kWh/rok przy zużyciu {f0(result.value.zuzycieRokKwh)} kWh/rok.
          </p>
          <TabelaBilansu wynik={result.value} tryb="siec" />
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </>
  )
}
