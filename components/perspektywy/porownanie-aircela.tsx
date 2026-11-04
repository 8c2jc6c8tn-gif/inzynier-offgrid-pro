"use client"

import { useFormaty, useTranslate } from "@/lib/i18n/language-context"
import {
  porownanieEpaliwa,
  ZALOZENIA_EPALIWA,
  type KrajPorownania,
  type OcenaOplacalnosci,
  type ScenariuszEpaliwa,
  type WierszPorownania,
  type Zakres,
} from "@/lib/perspektywy/e-paliwo"

const NAZWA_SCENARIUSZA: Record<ScenariuszEpaliwa, string> = {
  CIAGLY: "UI-PERSP-POR-SC-CIAGLY",
  WLASNE_PV: "UI-PERSP-POR-SC-PV",
}

const NAZWA_KRAJU: Record<KrajPorownania, string> = {
  PL: "UI-PERSP-POR-KRAJ-PL",
  NO: "UI-PERSP-POR-KRAJ-NO",
  NL: "UI-PERSP-POR-KRAJ-NL",
}

const NAZWA_OCENY: Record<OcenaOplacalnosci, string> = {
  TAK: "UI-PERSP-POR-OCENA-TAK",
  GRANICA: "UI-PERSP-POR-OCENA-GRANICA",
  NIE: "UI-PERSP-POR-OCENA-NIE",
}

const KLASA_OCENY: Record<OcenaOplacalnosci, string> = {
  TAK: "font-semibold text-foreground",
  GRANICA: "font-semibold text-foreground",
  NIE: "text-muted-foreground",
}

/** Two scenarios of powering the Aircela-class machine (continuous vs own PV) in one table, EUR with PLN in brackets. */
export function PorownanieAircela() {
  const t = useTranslate()
  const { f0, f1, f2 } = useFormaty()
  const zlZaEur = ZALOZENIA_EPALIWA.zlZaEur

  const cena = (z: Zakres) => {
    const jedna = Math.abs(z.max - z.min) < 0.005
    return jedna
      ? t("UI-PERSP-POR-CENA-JEDNA", { eur: f2(z.min), zl: f1(z.min * zlZaEur) })
      : t("UI-PERSP-POR-CENA-ZAKRES", {
          eurMin: f2(z.min),
          eurMax: f2(z.max),
          zlMin: f1(z.min * zlZaEur),
          zlMax: f1(z.max * zlZaEur),
        })
  }

  const litry = (z: Zakres) =>
    Math.round(z.max) === Math.round(z.min)
      ? t("UI-PERSP-POR-LITRY-JEDEN", { l: f0(Math.round(z.min / 10) * 10) })
      : t("UI-PERSP-POR-LITRY-ZAKRES", { min: f0(Math.round(z.min / 5) * 5), max: f0(Math.round(z.max / 5) * 5) })

  const wiersze: WierszPorownania[] = porownanieEpaliwa()

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[44rem] border-collapse text-small">
        <caption className="sr-only">{t("UI-PERSP-POR-OPIS-TABELI")}</caption>
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th scope="col" className="p-2 font-medium">{t("UI-PERSP-POR-KOL-RYNEK")}</th>
            <th scope="col" className="p-2 font-medium">{t("UI-PERSP-POR-KOL-LITRY")}</th>
            <th scope="col" className="p-2 font-medium">{t("UI-PERSP-POR-KOL-URZADZENIE")}</th>
            <th scope="col" className="p-2 font-medium">{t("UI-PERSP-POR-KOL-ENERGIA")}</th>
            <th scope="col" className="p-2 font-medium">{t("UI-PERSP-POR-KOL-RAZEM")}</th>
            <th scope="col" className="p-2 font-medium">{t("UI-PERSP-POR-KOL-STACJA")}</th>
            <th scope="col" className="p-2 font-medium">{t("UI-PERSP-POR-KOL-WNIOSEK")}</th>
          </tr>
        </thead>
        <tbody>
          {wiersze.map((w, i) => (
            <tr
              key={`${w.scenariusz}-${w.kraj}`}
              className={`border-t border-border align-top ${i === 3 ? "border-t-2" : ""}`}
            >
              <th scope="row" className="p-2 text-left font-medium">
                {t(NAZWA_SCENARIUSZA[w.scenariusz])}, {t(NAZWA_KRAJU[w.kraj])}
              </th>
              <td className="p-2 tabular-nums">{litry(w.litryRocznie)}</td>
              <td className="p-2 tabular-nums">{cena(w.urzadzenieEurL)}</td>
              <td className="p-2 tabular-nums">{cena(w.energiaEurL)}</td>
              <td className="p-2 font-semibold tabular-nums">{cena(w.razemEurL)}</td>
              <td className="p-2 tabular-nums">{cena(w.stacjaEurL)}</td>
              <td className={`p-2 ${KLASA_OCENY[w.ocena]}`}>{t(NAZWA_OCENY[w.ocena])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
