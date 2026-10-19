import { PODEJSCIA_EC7, KOLEJNOSC_PODEJSC_EC7, type PodejscieEc7 } from "../eurokod-7/przesuw"
import type { MetodaOporuGruntu } from "./input"

/** Factor c in H_u = c·γ·D·Kp·L³/(e + L): conservative Rankine pressure p = Kp·γ·z gives 1/6, Broms (p = 3·Kp·γ·z) gives 1/2. */
export const WSPOLCZYNNIK_METODY: Record<MetodaOporuGruntu, number> = { zachowawcza: 1 / 6, broms: 1 / 2 }

/** Rankine passive earth-pressure coefficient Kp = tan²(45° + φ/2). */
export function wspolczynnikBiernegoParcia(phiDeg: number): number {
  return Math.tan(((45 + phiDeg / 2) * Math.PI) / 180) ** 2
}

/** Design friction angle φ′d = atan(tan φ′k / γφ′) [°]. */
export function katTarciaObliczeniowyDeg(phiDeg: number, gammaPhi: number): number {
  return (Math.atan(Math.tan((phiDeg * Math.PI) / 180) / gammaPhi) * 180) / Math.PI
}

/**
 * Embedment L [m] of a rigid short pier (diameter D) so that H_u(L) ≥ H_d with the load at height e above the ground:
 * c·γ·D·Kp·L³ = H_d·(e + L). Bisection — the left side grows faster than the right one for large L.
 */
export function glebokoscZagleblenia(
  silaPoziomaN: number,
  ramieM: number,
  sredniceM: number,
  ciezarObjetosciowyNm3: number,
  kp: number,
  metoda: MetodaOporuGruntu,
): number {
  const a = WSPOLCZYNNIK_METODY[metoda] * ciezarObjetosciowyNm3 * sredniceM * kp
  const f = (l: number) => a * l ** 3 - silaPoziomaN * (ramieM + l)
  let lo = 0
  let hi = 1
  while (f(hi) < 0 && hi < 100) hi *= 2
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    if (f(mid) < 0) lo = mid
    else hi = mid
  }
  return hi
}

export type ZaglebienieWgPodejscia = Record<PodejscieEc7, number>

/** Embedment [m] for all four design approaches (A: γQ on the wind, M: γφ′ on tan φ′); the heaviest governs. */
export function zaglebienieEc7(
  silaWiatruN: number,
  ramieM: number,
  sredniceM: number,
  ciezarObjetosciowyNm3: number,
  phiDeg: number,
  metoda: MetodaOporuGruntu,
): { glebokoscM: number; podejscie: PodejscieEc7; wgPodejsc: ZaglebienieWgPodejscia } {
  const wgPodejsc = Object.fromEntries(
    KOLEJNOSC_PODEJSC_EC7.map((p) => {
      const w = PODEJSCIA_EC7[p]
      const kp = wspolczynnikBiernegoParcia(katTarciaObliczeniowyDeg(phiDeg, w.gammaPhi))
      return [p, glebokoscZagleblenia(w.gammaQ * silaWiatruN, ramieM, sredniceM, ciezarObjetosciowyNm3, kp, metoda)]
    }),
  ) as ZaglebienieWgPodejscia
  const podejscie = KOLEJNOSC_PODEJSC_EC7.reduce((a, b) => (wgPodejsc[b] > wgPodejsc[a] ? b : a))
  return { glebokoscM: wgPodejsc[podejscie], podejscie, wgPodejsc }
}
