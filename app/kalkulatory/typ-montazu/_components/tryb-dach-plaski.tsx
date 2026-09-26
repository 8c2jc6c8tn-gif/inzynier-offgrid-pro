"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateDachPlaski } from "@/lib/core/modules/pv/typ-montazu/dach-plaski"
import type { MiejsceMontazu } from "@/lib/core/modules/pv/typ-montazu/input"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import {
  BledyDanych,
  f0,
  f2,
  n,
  PolaStelaza,
  PolaWiatru,
  poziomZOstrzezen,
  STELAZ_PUSTY,
  stelazZSeeda,
  WIATR_PUSTY,
  wiatrZSeeda,
  type StelazSeed,
  type WiatrSeed,
} from "./wspolne"

type Seed = { miejsce: string; nachylenieDeg: string; stelaz: StelazSeed; wiatr: WiatrSeed }
const PUSTY: Seed = { miejsce: "", nachylenieDeg: "", stelaz: STELAZ_PUSTY, wiatr: WIATR_PUSTY }

export function TrybDachPlaski() {
  const { dane } = useLokalizacjaProjektu()
  const [s, setS] = usePersistedDraft<Seed>("typ-montazu-dach-plaski", PUSTY)
  const wysokoscPvgis = dane?.dane.meta.wysokoscNpmM
  const wynik = useMemo(
    () =>
      calculateDachPlaski({
        ...wiatrZSeeda(s.wiatr, wysokoscPvgis),
        ...stelazZSeeda(s.stelaz),
        miejsce: s.miejsce === "" ? null : (s.miejsce as MiejsceMontazu),
        nachylenieDeg: n(s.nachylenieDeg),
      }),
    [s, wysokoscPvgis],
  )
  const v = wynik.value

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted-foreground">
        Stelaż pod kątem na dachu płaskim albo na gruncie. Im większy kąt, tym wyżej podnosi się górna krawędź i tym mocniej
        wiatr próbuje poderwać panele.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <PoleSelect label="Gdzie stoi stelaż" value={s.miejsce} onChange={(e) => setS((p) => ({ ...p, miejsce: e.target.value }))}>
          <option value="">— wybierz —</option>
          <option value="grunt">Na gruncie</option>
          <option value="dach">Na dachu płaskim</option>
        </PoleSelect>
        <Pole
          label="Kąt nachylenia stelaża"
          unit="°"
          type="number"
          inputMode="decimal"
          min={0}
          max={90}
          value={s.nachylenieDeg}
          onChange={(e) => setS((p) => ({ ...p, nachylenieDeg: e.target.value }))}
        />
      </div>
      <PolaStelaza
        s={s.stelaz}
        ustaw={(pole, x) => setS((p) => ({ ...p, stelaz: { ...p.stelaz, [pole]: x } }))}
        podpowiedzKrawedzi="Na dachu — wysokość budynku plus odstęp paneli od dachu."
      />
      <PolaWiatru s={s.wiatr} ustaw={(pole, x) => setS((p) => ({ ...p, wiatr: { ...p.wiatr, [pole]: x } }))} wysokoscPvgis={wysokoscPvgis} />

      {wynik.status === "INVALID_INPUT" && <BledyDanych warnings={wynik.warnings} />}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">Uzupełnij wszystkie pola, żeby zobaczyć wynik.</p>}
      {v && (
        <WerdyktPanel poziom={poziomZOstrzezen(wynik.warnings)} etykieta={`Kąt ${s.nachylenieDeg}° — podniesienie górnej krawędzi`}>
          <WynikGlowny>{f2(v.podniesienieM)} m</WynikGlowny>
          <ul className="mt-2 space-y-1 text-small">
            <li>
              Górna krawędź {f2(v.zeM)} m nad terenem, powierzchnia paneli {f2(v.powierzchniaM2)} m².
            </li>
            <li>
              {v.silaWiatruN === null
                ? "Siła wiatru: brak danych normowych dla tego kąta."
                : `Siła wiatru: ${f0(v.silaWiatruN)} N (≈ ${f0(v.silaWiatruN / PRZYSPIESZENIE_ZIEMSKIE_M_S2)} kg)${v.balastKg === null ? " — pozioma, bez balastu w kg." : "."}`}
            </li>
            {v.balastKg !== null && <li className="font-medium">Balast projektowy (PN-EN 1990, przeciw oderwaniu): {f0(v.balastKg)} kg na stelaż.</li>}
            <li>Śnieg: na panelach zostaje {f0(v.mu1 * 100)}% obciążenia śniegiem gruntu (μ1 = {f2(v.mu1)}).</li>
          </ul>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} />
          <p className="mt-2 text-small">
            Porównanie wszystkich kątów, koszt balastu i porady wykonania (bloczki, słupki kotwiczące):{" "}
            <Link href="/kalkulatory/zloty-srodek" className="underline">
              Złoty środek
            </Link>
            .
          </p>
        </WerdyktPanel>
      )}
    </div>
  )
}
