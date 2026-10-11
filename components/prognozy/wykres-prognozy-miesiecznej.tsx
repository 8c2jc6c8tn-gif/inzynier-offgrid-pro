/**
 * Bar chart of the monthly production forecast (module 10, 12.3) as plain SVG — works offline and in the dark theme (`currentColor`).
 * Filled bar = forecast, dashed outline = the same month a year earlier, vertical whisker = low/high scenario.
 */
import type { WierszPrognozy } from "@/lib/core/modules/ai/prognoza-miesieczna/calculator"
import { useTranslate } from "@/lib/i18n/language-context"

const KLUCZE_MIESIECY = Array.from({ length: 12 }, (_, i) => `UI-MIES-${String(i + 1).padStart(2, "0")}`)
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export function WykresPrognozyMiesiecznej({ wiersze }: { wiersze: readonly WierszPrognozy[] }) {
  const t = useTranslate()
  const max = Math.max(1, ...wiersze.map((w) => Math.max(w.historiaKwh ?? 0, w.prognozaKwh ?? 0, w.gornaKwh ?? 0)))
  const W = 360
  const H = 150
  const dol = 128
  const szer = W / wiersze.length
  const y = (v: number) => dol - (v / max) * (dol - 16)
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="font-medium">{t("UI-PROGMIES-WYKRES")}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t("UI-PROGMIES-WYKRES-OPIS")}>
        {wiersze.map((w, i) => {
          const x = i * szer + Math.min(6, szer * 0.15)
          const bar = szer - 2 * Math.min(6, szer * 0.15)
          const nazwa = t(KLUCZE_MIESIECY[w.miesiac - 1]!)
          return (
            <g key={i}>
              {w.historiaKwh !== null && (
                <rect x={x} y={y(w.historiaKwh)} width={bar} height={dol - y(w.historiaKwh)} fill="none" stroke="currentColor" strokeDasharray="3 2">
                  <title>{t("UI-PROGMIES-WYKRES-HISTORIA", { m: nazwa, kwh: f0(w.historiaKwh) })}</title>
                </rect>
              )}
              {w.prognozaKwh !== null && (
                <rect x={x} y={y(w.prognozaKwh)} width={bar} height={dol - y(w.prognozaKwh)} className="fill-current opacity-60">
                  <title>{t("UI-PROGMIES-WYKRES-PROGNOZA", { m: nazwa, kwh: f0(w.prognozaKwh) })}</title>
                </rect>
              )}
              {w.dolnaKwh !== null && w.gornaKwh !== null && (
                <line x1={x + bar / 2} x2={x + bar / 2} y1={y(w.gornaKwh)} y2={y(w.dolnaKwh)} stroke="currentColor" strokeWidth={2}>
                  <title>{t("UI-PROGMIES-WYKRES-SCENARIUSZ", { m: nazwa, dol: f0(w.dolnaKwh), gora: f0(w.gornaKwh) })}</title>
                </line>
              )}
              <text x={i * szer + szer / 2} y={H - 6} textAnchor="middle" className="fill-current text-[10px]">
                {nazwa}
              </text>
            </g>
          )
        })}
        <line x1={0} x2={W} y1={dol} y2={dol} stroke="currentColor" strokeOpacity={0.4} />
        <text x={2} y={10} className="fill-current text-[10px]">
          {t("UI-PROGMIES-WYKRES-MAKS", { max: f0(max) })}
        </text>
      </svg>
    </figure>
  )
}
