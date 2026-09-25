"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateWiata, type BlokPaneli, type Podzial } from "@/lib/core/modules/pv/typ-montazu/wiata"
import { BledyDanych, f0, f2, n, poziomZOstrzezen } from "./wspolne"

type Seed = { dlugoscM: string; szerokoscM: string; dlugoscPaneluM: string; szerokoscPaneluM: string; mocPaneluW: string; nachylenieDeg: string }
const PUSTY: Seed = { dlugoscM: "", szerokoscM: "", dlugoscPaneluM: "", szerokoscPaneluM: "", mocPaneluW: "", nachylenieDeg: "" }

const POLA: { pole: keyof Seed; label: string; unit: string; hint?: string }[] = [
  { pole: "dlugoscM", label: "Długość wiaty", unit: "m", hint: "Wymiar połaci po jej powierzchni (wzdłuż spadku), nie rzut z góry." },
  { pole: "szerokoscM", label: "Szerokość wiaty", unit: "m" },
  { pole: "dlugoscPaneluM", label: "Długość panelu", unit: "m" },
  { pole: "szerokoscPaneluM", label: "Szerokość panelu", unit: "m" },
  { pole: "mocPaneluW", label: "Moc jednego panelu", unit: "Wp" },
  { pole: "nachylenieDeg", label: "Kąt nachylenia dachu wiaty", unit: "°" },
]

/** Rzut połaci z blokami paneli (skala wspólna); długość wiaty poziomo. */
function Rzut({ L, W, dl, sz, bloki, podzial }: { L: number; W: number; dl: number; sz: number; bloki: BlokPaneli[]; podzial: Podzial }) {
  const skala = 340 / Math.max(L, W)
  const prostokaty: { x: number; y: number; w: number; h: number }[] = []
  let x0 = 0
  let y0 = 0
  for (const b of bloki) {
    const [pw, ph] = b.orientacja === "wzdluzDlugosci" ? [dl, sz] : [sz, dl]
    for (let i = 0; i < b.kolumny; i++) for (let j = 0; j < b.rzedy; j++) prostokaty.push({ x: x0 + i * pw, y: y0 + j * ph, w: pw, h: ph })
    if (podzial === "obokWzdluzDlugosci") x0 += b.kolumny * pw
    else y0 += b.rzedy * ph
  }
  return (
    <svg viewBox={`-2 -2 ${L * skala + 4} ${W * skala + 4}`} className="w-full max-w-sm text-foreground" role="img" aria-label="Rzut połaci wiaty z ułożeniem paneli">
      <rect x={0} y={0} width={L * skala} height={W * skala} className="fill-muted stroke-muted-foreground" strokeWidth={1} />
      {prostokaty.map((p, i) => (
        <rect key={i} x={p.x * skala + 1} y={p.y * skala + 1} width={p.w * skala - 2} height={p.h * skala - 2} rx={2} className="fill-sky-600/80" />
      ))}
    </svg>
  )
}

export function TrybWiata() {
  const [s, setS] = usePersistedDraft<Seed>("typ-montazu-wiata", PUSTY)
  const wynik = useMemo(
    () =>
      calculateWiata({
        dlugoscM: n(s.dlugoscM),
        szerokoscM: n(s.szerokoscM),
        dlugoscPaneluM: n(s.dlugoscPaneluM),
        szerokoscPaneluM: n(s.szerokoscPaneluM),
        mocPaneluW: n(s.mocPaneluW),
        nachylenieDeg: n(s.nachylenieDeg),
      }),
    [s],
  )
  const v = wynik.value
  const dl = Math.max(n(s.dlugoscPaneluM) ?? 0, n(s.szerokoscPaneluM) ?? 0)
  const sz = Math.min(n(s.dlugoscPaneluM) ?? 0, n(s.szerokoscPaneluM) ?? 0)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        Wiata albo carport z panelami zamiast pokrycia. Aplikacja szuka ułożenia, które zmieści najwięcej paneli na
        prostokątnej połaci, i sprawdza, czy spadek wystarczy, żeby deszcz sam mył panele.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {POLA.map((p) => (
          <Pole
            key={p.pole}
            label={p.label}
            unit={p.unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={s[p.pole]}
            onChange={(e) => setS((prev) => ({ ...prev, [p.pole]: e.target.value }))}
            hint={p.hint}
          />
        ))}
      </div>

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">Uzupełnij wymiary, moc panelu i kąt.</p>}
      {v && (
        <WerdyktPanel poziom={poziomZOstrzezen(wynik.warnings)} etykieta={`Na wiacie ${f2(n(s.dlugoscM)!)} × ${f2(n(s.szerokoscM)!)} m zmieścisz`}>
          <WynikGlowny>
            {v.liczbaPaneli} {odmianaPanel(v.liczbaPaneli)} — {f2(v.mocKwp)} kWp
          </WynikGlowny>
          <ul className="mt-2 space-y-1 text-small">
            {v.bloki.map((b, i) => (
              <li key={i}>
                {b.kolumny} × {b.rzedy} — dłuższy bok panelu wzdłuż {b.orientacja === "wzdluzDlugosci" ? "długości" : "szerokości"} wiaty
              </li>
            ))}
            <li>Panele pokrywają {f0(v.pokryciePct)}% połaci.</li>
          </ul>
          {v.liczbaPaneli > 0 && (
            <div className="mt-3">
              <Rzut L={n(s.dlugoscM)!} W={n(s.szerokoscM)!} dl={dl} sz={sz} bloki={v.bloki} podzial={v.podzial} />
            </div>
          )}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
    </div>
  )
}

function odmianaPanel(liczba: number): string {
  if (liczba === 1) return "panel"
  const r10 = liczba % 10
  const r100 = liczba % 100
  return r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14) ? "panele" : "paneli"
}
