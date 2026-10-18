/**
 * Timeline chart of the SoC forecast (module 10, 12.4 + 12.43) as plain SVG — works offline and in the dark theme (`currentColor`).
 * Thick line = state of charge (0–100 %), dashed line = the lowest allowed charge, light bars = PV production, outlined bars = consumption.
 */
import type { PrognozaSocResult } from "@/lib/core/modules/ai/prognoza-soc/calculator"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

export function WykresSoc({ wynik, socMinPct, godzinaStartu }: { wynik: PrognozaSocResult; socMinPct: number; godzinaStartu: number }) {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const f1 = (x: number) => formatLiczbe(x, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const H = wynik.godziny.length
  const W = 360
  const wys = 170
  const dol = 140
  const gora = 14
  const krok = W / H
  const maxKw = Math.max(0.001, ...wynik.godziny.map((g) => Math.max(g.produkcjaKw, g.zuzycieKw)))
  const ySoc = (p: number) => dol - (p / 100) * (dol - gora)
  const yKw = (kw: number) => dol - (kw / maxKw) * (dol - gora) * 0.5
  const linia = wynik.socSeriaPct.map((p, i) => `${i === 0 ? "M" : "L"}${(i * krok).toFixed(1)},${ySoc(p).toFixed(1)}`).join(" ")
  // a tick every 6 h of the clock, labelled with the clock hour
  const znaczniki = Array.from({ length: H + 1 }, (_, i) => i).filter((i) => (godzinaStartu + i) % 6 === 0)
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="font-medium">{t("UI-PROGSOC-WYKRES")}</figcaption>
      <svg viewBox={`0 0 ${W} ${wys}`} className="w-full" role="img" aria-label={t("UI-PROGSOC-WYKRES-OPIS")}>
        {wynik.godziny.map((g) => (
          <g key={g.t}>
            <rect x={g.t * krok} y={yKw(g.produkcjaKw)} width={Math.max(1, krok - 0.5)} height={dol - yKw(g.produkcjaKw)} className="fill-current opacity-20">
              <title>{t("UI-PROGSOC-WYKRES-GODZINA", { t: String(g.t), prod: f1(g.produkcjaKw), zuz: f1(g.zuzycieKw), soc: f1(g.socPct) })}</title>
            </rect>
            <rect x={g.t * krok} y={yKw(g.zuzycieKw)} width={Math.max(1, krok - 0.5)} height={dol - yKw(g.zuzycieKw)} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={0.5} />
          </g>
        ))}
        <line x1={0} x2={W} y1={ySoc(socMinPct)} y2={ySoc(socMinPct)} stroke="currentColor" strokeDasharray="4 3" strokeOpacity={0.6} />
        <path d={linia} fill="none" stroke="currentColor" strokeWidth={2} />
        <line x1={0} x2={W} y1={dol} y2={dol} stroke="currentColor" strokeOpacity={0.4} />
        {znaczniki.map((i) => (
          <text key={i} x={Math.min(W - 10, Math.max(2, i * krok - 8))} y={wys - 6} className="fill-current text-[10px]">
            {String((godzinaStartu + i) % 24).padStart(2, "0")}:00
          </text>
        ))}
        <text x={2} y={10} className="fill-current text-[10px]">
          100 %
        </text>
      </svg>
    </figure>
  )
}
