"use client"

import { isComputed } from "@/lib/core/calc-result"
import { useMemo } from "react"
import { DANE_ROZLICZEN } from "@/lib/core/dane/rozliczenia-pl-2026"
import { calculateSciezkaCen } from "@/lib/core/modules/siec/sciezka-cen-energii/calculator"
import { SUWAK_WARTOSCI_PROCENT } from "@/lib/core/modules/siec/sciezka-cen-energii/constants"
import type { TrybSciezki, ZrodloInflacji } from "@/lib/core/modules/siec/sciezka-cen-energii/input"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { PrzyciskSegmentu as Segment } from "./wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * M14 — the single field „Wzrost cen energii” of D7/F8 (D42): a three-position segmented switch,
 * and under it — in the same place — the slider, the EU path or the EU path + inflation (D40, D41,
 * default GUS inflation D43). Every change recalculates the A–D table at once.
 */
export type StanWzrostuCen = {
  rodzaj: TrybSciezki["rodzaj"]
  gProcent: number
  zrodloInflacji: ZrodloInflacji
  wlasnaInflacja: string
}

export const POCZATKOWY_WZROSTU: StanWzrostuCen = { rodzaj: "suwak", gProcent: 0, zrodloInflacji: "gus", wlasnaInflacja: "" }

export function trybZeStanu(s: StanWzrostuCen): TrybSciezki {
  if (s.rodzaj === "suwak") return { rodzaj: "suwak", gProcent: s.gProcent }
  if (s.rodzaj === "ue") return { rodzaj: "ue" }
  return {
    rodzaj: "ue-inflacja",
    zrodloInflacji: s.zrodloInflacji,
    wlasnaInflacjaProcent: s.wlasnaInflacja === "" ? null : Number(s.wlasnaInflacja),
  }
}

/** At most two decimals; `t()` adds the decimal separator of the language. */
const dwaMiejsca = (x: number) => Math.round(x * 100) / 100

/** `etykieta` is a translation key (`t()`). */
const POZYCJE: { id: TrybSciezki["rodzaj"]; etykieta: string }[] = [
  { id: "suwak", etykieta: "UI-WZR-SUWAK" },
  { id: "ue", etykieta: "UI-WZR-UE" },
  { id: "ue-inflacja", etykieta: "UI-WZR-UE-INFLACJA" },
]


export function PoleWzrostuCen({
  stan,
  onChange,
  rokBazowy,
  horyzontLat,
}: {
  stan: StanWzrostuCen
  onChange: (z: Partial<StanWzrostuCen>) => void
  rokBazowy: number
  horyzontLat: number
}) {
  const t = useTranslate(true)
  const sciezka = useMemo(
    () => calculateSciezkaCen({ rokBazowy, horyzontLat, kosztRocznyZl: 1, tryb: trybZeStanu(stan) }),
    [stan, rokBazowy, horyzontLat],
  )
  return (
    <fieldset className="flex flex-col gap-3 rounded-md border p-3">
      <legend className="flex items-center gap-1.5 px-1 text-small font-medium">
        {t("UI-WZR-LEGENDA")} <PomocPola ekran="siec-wzrost-cen" pole="zrodlo" />
      </legend>
      <div className="flex gap-1 rounded-md bg-muted/50 p-1" role="group" aria-label={t("UI-WZR-ZRODLO-ARIA")}>
        {POZYCJE.map((p) => (
          <Segment key={p.id} aktywny={stan.rodzaj === p.id} onClick={() => onChange({ rodzaj: p.id })}>
            {t(p.etykieta)}
          </Segment>
        ))}
      </div>
      {stan.rodzaj === "suwak" ? (
        <div className="flex gap-1" role="group" aria-label={t("UI-WZR-SUWAK-ARIA")}>
          {SUWAK_WARTOSCI_PROCENT.map((g) => (
            <Segment key={g} aktywny={stan.gProcent === g} onClick={() => onChange({ gProcent: g })}>
              {t("UI-WZR-SUWAK-G", { g: `${g > 0 ? "+" : ""}${g}` })}
            </Segment>
          ))}
        </div>
      ) : (
        <>
          {stan.rodzaj === "ue-inflacja" && (
            <>
              <PoleSelect
                label={t("UI-WZR-INFLACJA")}
                value={stan.zrodloInflacji}
                onChange={(e) => onChange({ zrodloInflacji: e.target.value as ZrodloInflacji })}
                pomoc={<PomocPola ekran="siec-wzrost-cen" pole="inflacjaZrodlo" />}
              >
                <option value="gus">{t("UI-WZR-INFL-GUS")}</option>
                <option value="nbp">{t("UI-WZR-INFL-NBP")}</option>
                <option value="wlasna">{t("UI-WZR-INFL-WLASNA")}</option>
              </PoleSelect>
              {stan.zrodloInflacji === "wlasna" && (
                <Pole
                  label={t("UI-WZR-INFLACJA")}
                  unit={t("UI-J-PROC-ROK")}
                  type="number"
                  inputMode="decimal"
                  value={stan.wlasnaInflacja}
                  onChange={(e) => onChange({ wlasnaInflacja: e.target.value })}
                  pomoc={<PomocPola ekran="siec-wzrost-cen" pole="inflacjaWlasna" />}
                />
              )}
            </>
          )}
          {isComputed(sciezka.status) ? (
            <p className="text-small">
              {t("UI-WZR-SREDNIO", {
                srednia: dwaMiejsca(sciezka.value.sredniaProcentRok),
                lat: horyzontLat,
                data: DANE_ROZLICZEN.sciezkaUe.stanNa,
              })}
              {sciezka.value.inflacjaProcent !== null &&
                t("UI-WZR-INFLACJA-DOPISEK", { inflacja: dwaMiejsca(sciezka.value.inflacjaProcent) })}
              .
            </p>
          ) : null}
          <WynikSzczegoly assumptions={sciezka.assumptions} warnings={sciezka.warnings} />
        </>
      )}
    </fieldset>
  )
}
