/**
 * Ekran 3 Modułu 1 — podsumowanie mapy cieplnej jednej powierzchni: kalkulator zacienienia liczy
 * jeden punkt, powierzchnia to siatka punktów (`punktyProbkowania`). Tu tylko uśrednienie wyników
 * punktów (równe wagi — punkty siatki reprezentują równe pola rzutu), bez własnej fizyki.
 */
import type { CalcResult } from "@/lib/core/calc-result"
import type { AnalizaZacienieniaResult, ScenariuszZacienienia } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import type { Punkt3D } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/input"

export type ScenariuszPowierzchni = {
  strataRocznaProcent: number
  strataMiesiecznaProcent: number[]
  /** Średni udział przeszkód [p.p.], od największego; przeszkody z zerowym udziałem pominięte. */
  udzialPrzeszkod: { nazwa: string; procent: number }[]
}

export type PodsumowaniePowierzchni = {
  obecnie: ScenariuszPowierzchni
  prognoza: ScenariuszPowierzchni | null
  /** Strata w każdym punkcie siatki (obecnie) — kolory mapy cieplnej; null — punkt pominięty. */
  strataPunktow: (number | null)[]
  /** Profil horyzontu z punktu najbliższego środkowi powierzchni [°, co 1° azymutu]. */
  profilHoryzontuDeg: number[]
  /** Punkty odrzucone przez walidację (np. wewnątrz korony drzewa). */
  pominiete: number
}

function srednia(scenariusze: ScenariuszZacienienia[]): ScenariuszPowierzchni {
  const n = scenariusze.length
  const miesiace = Array.from({ length: 12 }, (_, m) => scenariusze.reduce((a, s) => a + (s.strataMiesiecznaProcent[m] ?? 0), 0) / n)
  const udzialy = new Map<string, number>()
  for (const s of scenariusze) for (const u of s.udzialPrzeszkod) udzialy.set(u.nazwa, (udzialy.get(u.nazwa) ?? 0) + u.procent / n)
  return {
    strataRocznaProcent: scenariusze.reduce((a, s) => a + s.strataRocznaProcent, 0) / n,
    strataMiesiecznaProcent: miesiace,
    udzialPrzeszkod: [...udzialy]
      .map(([nazwa, procent]) => ({ nazwa, procent }))
      .filter((u) => u.procent > 0)
      .sort((a, b) => b.procent - a.procent),
  }
}

/** null — żaden punkt nie dał wyniku (wszystkie odrzucone przez walidację). */
export function podsumujPowierzchnie(
  punkty: Punkt3D[],
  wyniki: CalcResult<AnalizaZacienieniaResult>[],
): PodsumowaniePowierzchni | null {
  const poprawne = wyniki.map((w) => (w.status === "VALID" || w.status === "VALID_WITH_WARNINGS" ? w.value : null))
  const ok = poprawne.filter((v): v is AnalizaZacienieniaResult => v !== null)
  if (ok.length === 0) return null

  const sx = punkty.reduce((a, p) => a + p.x, 0) / punkty.length
  const sy = punkty.reduce((a, p) => a + p.y, 0) / punkty.length
  let najblizszy = -1
  let dMin = Infinity
  punkty.forEach((p, i) => {
    const d = Math.hypot(p.x - sx, p.y - sy)
    if (poprawne[i] && d < dMin) {
      dMin = d
      najblizszy = i
    }
  })

  const prognozy = ok.map((v) => v.prognoza).filter((s): s is ScenariuszZacienienia => s !== null)
  return {
    obecnie: srednia(ok.map((v) => v.obecnie)),
    prognoza: prognozy.length === ok.length ? srednia(prognozy) : null,
    strataPunktow: poprawne.map((v) => (v ? v.obecnie.strataRocznaProcent : null)),
    profilHoryzontuDeg: poprawne[najblizszy]!.obecnie.profilHoryzontuDeg,
    pominiete: poprawne.length - ok.length,
  }
}
