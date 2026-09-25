"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculatePionowy } from "@/lib/core/modules/pv/typ-montazu/pionowy"
import { BledyDanych, f0, f1, MIESIACE, n, PoleAzymutu, poziomZOstrzezen, useTabelaNapromieniowania, znak } from "./wspolne"

type Seed = { azymutDeg: string; wysokoscDolnejKrawedziM: string; wysokoscTrawySnieguCm: string }
const PUSTY: Seed = { azymutDeg: "", wysokoscDolnejKrawedziM: "", wysokoscTrawySnieguCm: "" }

/** Słupki różnicy pion − najlepszy kąt stały [%] dla 12 miesięcy; w górę = pion zbiera więcej. */
function WykresRoznicy({ wartosci }: { wartosci: (number | null)[] }) {
  const W = 360
  const H = 150
  const max = Math.max(...wartosci.map((v) => Math.abs(v ?? 0)), 1)
  const zero = H / 2
  const szer = W / 12
  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full text-foreground" role="img" aria-label="Różnica pion minus najlepszy kąt stały, miesiąc po miesiącu">
      <line x1={0} y1={zero} x2={W} y2={zero} className="stroke-muted-foreground/60" strokeWidth={1} />
      {wartosci.map((v, m) => {
        if (v === null) return null
        const h = (Math.abs(v) / max) * (zero - 6)
        return (
          <g key={m}>
            <rect x={m * szer + 3} y={v >= 0 ? zero - h : zero} width={szer - 6} height={Math.max(h, 1)} rx={2} className={v >= 0 ? "fill-sky-500/80" : "fill-muted-foreground/50"}>
              <title>{`${MIESIACE[m]}: ${znak(v)}%`}</title>
            </rect>
            <text x={m * szer + szer / 2} y={H + 12} textAnchor="middle" className="fill-muted-foreground text-[9px]">
              {MIESIACE[m]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function TrybPionowy() {
  const [s, setS] = usePersistedDraft<Seed>("typ-montazu-pionowy", PUSTY)
  const ustaw = (p: keyof Seed, v: string) => setS((prev) => ({ ...prev, [p]: v }))
  const tab = useTabelaNapromieniowania(s.azymutDeg)
  const wynik = useMemo(
    () => calculatePionowy({ tabela: tab.tabela, wysokoscDolnejKrawedziM: n(s.wysokoscDolnejKrawedziM), wysokoscTrawySnieguCm: n(s.wysokoscTrawySnieguCm) }),
    [tab.tabela, s.wysokoscDolnejKrawedziM, s.wysokoscTrawySnieguCm],
  )
  const v = wynik.value

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        Panele na ogrodzeniu, ścianie albo pionowym stelażu. Zimą słońce jest nisko, więc pion łapie je pod lepszym kątem niż
        panele pochylone — latem odwrotnie. Aplikacja porównuje pion z najlepszym stałym kątem dla tego samego kierunku,
        miesiąc po miesiącu.
      </p>
      <PoleAzymutu wartosc={s.azymutDeg} ustaw={(x) => ustaw("azymutDeg", x)} tab={tab} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Pole
          label="Dolna krawędź paneli nad gruntem"
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={s.wysokoscDolnejKrawedziM}
          onChange={(e) => ustaw("wysokoscDolnejKrawedziM", e.target.value)}
        />
        <Pole
          label="Trawa lub zaspy śniegu w okolicy"
          unit="cm"
          type="number"
          inputMode="decimal"
          min={0}
          value={s.wysokoscTrawySnieguCm}
          onChange={(e) => ustaw("wysokoscTrawySnieguCm", e.target.value)}
          hint="Najwyższe, jakie zdarzają się przy panelach."
        />
      </div>

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">Wpisz azymut i policz nasłonecznienie, żeby zobaczyć bilans.</p>}
      {v && (
        <WerdyktPanel poziom={poziomZOstrzezen(wynik.warnings)} etykieta={`Pion vs najlepszy kąt stały (${v.optimumDeg}°)`}>
          <WynikGlowny>{znak(v.roznicaRocznaPct)}% rocznie</WynikGlowny>
          <p className="mt-1 text-small">
            {v.miesiaceZysku.length > 0
              ? `Pion zbiera więcej w: ${v.miesiaceZysku.map((m) => MIESIACE[m]).join(", ")} (razem +${f1(v.zyskKwhM2)} kWh/m²). W pozostałych miesiącach mniej (razem −${f1(v.strataKwhM2)} kWh/m²).`
              : `Pion nie wygrywa w żadnym miesiącu — traci razem ${f1(v.strataKwhM2)} kWh/m² rocznie.`}
          </p>
          <p className="mt-1 text-small">
            Rocznie: pion {f0(v.pionowyRocznieKwhM2)} kWh/m², najlepszy kąt stały {f0(v.optimumRocznieKwhM2)} kWh/m².
          </p>
          <figure className="mt-3">
            <figcaption className="text-small font-medium">Różnica pion − kąt {v.optimumDeg}° w każdym miesiącu [%]</figcaption>
            <WykresRoznicy wartosci={v.miesiace.map((m) => m.roznicaPct)} />
          </figure>
          {v.zaspaZacienia === false && <p className="mt-1 text-small">Trawa i zaspy nie sięgają dolnej krawędzi paneli.</p>}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
    </div>
  )
}
