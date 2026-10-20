/**
 * Wykresy Ekranu 3 (Moduł 1) jako czyste SVG — bez biblioteki wykresów, działają offline i w
 * ciemnym motywie (`currentColor`). Tylko rysowanie wyników kalkulatora.
 */

import { useTranslate, useFormaty } from "@/lib/i18n/language-context"

export const MIESIACE = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

export function WykresMiesiecy({ obecnie, prognoza }: { obecnie: number[]; prognoza: number[] | null }) {
  const t = useTranslate()
  const { f1 } = useFormaty()
  const max = Math.max(1, ...obecnie, ...(prognoza ?? []))
  const W = 360
  const H = 140
  const dol = 118
  const szer = W / 12
  const y = (v: number) => dol - (v / max) * (dol - 14)
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="font-medium">{t("UI-WYKZAC-STRATA-MIESIACACH")}{prognoza ? ` ${t("UI-WYKZAC-OBECNIE-PELNE-PROGNOZA")}` : ""}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t("UI-WYKZAC-STRATA-PROMIENIOWANIA-KOLEJN")}>
        {obecnie.map((v, m) => (
          <g key={m}>
            <rect x={m * szer + 4} y={y(v)} width={szer - 8} height={dol - y(v)} className="fill-current opacity-70">
              <title>{`${MIESIACE[m]}: ${f1(v)}%`}</title>
            </rect>
            {prognoza && (
              <rect x={m * szer + 4} y={y(prognoza[m]!)} width={szer - 8} height={dol - y(prognoza[m]!)} fill="none" stroke="currentColor" strokeDasharray="3 2">
                <title>{t("UI-WYKZAC-PROGNOZA", { p: MIESIACE[m], p2: f1(prognoza[m]!) })}</title>
              </rect>
            )}
            <text x={m * szer + szer / 2} y={H - 6} textAnchor="middle" className="fill-current text-[10px]">
              {MIESIACE[m]}
            </text>
          </g>
        ))}
        <line x1={0} x2={W} y1={dol} y2={dol} stroke="currentColor" strokeOpacity={0.4} />
        <text x={2} y={10} className="fill-current text-[10px]">
          {t("UI-WYKZAC-MAKS", { max: f1(max) })}
        </text>
      </svg>
    </figure>
  )
}

/** Profil horyzontu przeszkód: kąt wzniesienia [°] w funkcji azymutu (co 1°, od północy). */
export function WykresHoryzontu({ profilDeg }: { profilDeg: number[] }) {
  const t = useTranslate()
  const { f1 } = useFormaty()
  const max = Math.max(10, ...profilDeg)
  const W = 360
  const H = 130
  const dol = 110
  const y = (v: number) => dol - (v / max) * (dol - 10)
  const krok = W / profilDeg.length
  const d = `M0,${dol} ` + profilDeg.map((v, i) => `L${(i * krok).toFixed(1)},${y(v).toFixed(1)}`).join(" ") + ` L${W},${dol} Z`
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="font-medium">{t("UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD")}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t("UI-WYKZAC-PROFIL-HORYZONTU-PRZESZKOD-2")}>
        <path d={d} className="fill-current opacity-40" />
        {["N", "E", "S", "W", "N"].map((k, i) => (
          <g key={i}>
            <line x1={i * 90} x2={i * 90} y1={10} y2={dol} stroke="currentColor" strokeOpacity={0.15} />
            <text x={Math.min(W - 8, Math.max(2, i * 90 - 4))} y={H - 4} className="fill-current text-[10px]">
              {k}
            </text>
          </g>
        ))}
        <line x1={0} x2={W} y1={dol} y2={dol} stroke="currentColor" strokeOpacity={0.4} />
        <text x={2} y={10} className="fill-current text-[10px]">
          {f1(max)}°
        </text>
      </svg>
    </figure>
  )
}
