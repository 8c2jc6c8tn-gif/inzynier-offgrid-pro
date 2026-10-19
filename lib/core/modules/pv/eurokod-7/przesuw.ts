/**
 * PN-EN 1997-1:2008 (Eurokod 7) — sliding resistance of a shallow foundation, p. 6.5.3. Values verified visually against the Polish
 * scan on 19.10.2026 (`docs/zrodla/norma-PN-EN-1997-1-eurokod-7/00-INDEKS.md`):
 *  - 6.5.3 (2)P, (6.2): H_d ≤ R_d + R_p;d — passive resistance R_p;d is neglected (safe side);
 *  - 6.5.3 (8)P, drained: R_d = V_d′·tan δ_d (6.3a) or R_d = (V_d′·tan δ_k)/γ_R;h (6.3b);
 *  - 6.5.3 (10): δ_d = φ′_cv;d for cast-in-situ concrete, 2/3·φ′_cv;d for smooth precast foundations; cohesion c′ neglected;
 *  - 2.4.7.3.4 design approaches: DA1 = A1+M1+R1 and A2+M2+R1, DA2 = A1+M1+R2, DA3 = (A1|A2)+M2+R3;
 *  - Annex A recommended values: Table A.3 (γ_G favourable 1,0 in A1 and A2; γ_Q unfavourable 1,5 in A1, 1,3 in A2),
 *    Table A.4 (γ_φ′ = 1,0 in M1, 1,25 in M2, applied to tan φ′), Table A.5 (γ_R;h = 1,0 / 1,1 / 1,0 for R1 / R2 / R3).
 * The Polish National Annex (which approach applies, whether the recommended values hold) was NOT available — so the check is run
 * with ALL four combinations and the heaviest ballast is taken. The tables below are the only place to change when it arrives.
 */
export type PodejscieEc7 = "PO1-K1" | "PO1-K2" | "PO2" | "PO3"

export type WspolczynnikiPodejscia = {
  /** γ_Q for the unfavourable variable action — the wind (Table A.3: A1 1,5; A2 1,3). */
  gammaQ: number
  /** γ_G for the favourable permanent action — ballast and self-weight (Table A.3: 1,0 in A1 and A2). */
  gammaGKorzystne: number
  /** γ_φ′ applied to tan δ (Table A.4: M1 1,0; M2 1,25). */
  gammaPhi: number
  /** γ_R;h for sliding resistance (Table A.5: R1 1,0; R2 1,1; R3 1,0). */
  gammaRh: number
}

export const PODEJSCIA_EC7: Record<PodejscieEc7, WspolczynnikiPodejscia> = {
  "PO1-K1": { gammaQ: 1.5, gammaGKorzystne: 1.0, gammaPhi: 1.0, gammaRh: 1.0 }, // A1 + M1 + R1
  "PO1-K2": { gammaQ: 1.3, gammaGKorzystne: 1.0, gammaPhi: 1.25, gammaRh: 1.0 }, // A2 + M2 + R1
  PO2: { gammaQ: 1.5, gammaGKorzystne: 1.0, gammaPhi: 1.0, gammaRh: 1.1 }, // A1 + M1 + R2
  PO3: { gammaQ: 1.5, gammaGKorzystne: 1.0, gammaPhi: 1.25, gammaRh: 1.0 }, // A1 + M2 + R3 (wind = structural action → A1)
}

/** Kolejność = priorytet przy remisie. */
export const KOLEJNOSC_PODEJSC_EC7: readonly PodejscieEc7[] = ["PO1-K1", "PO1-K2", "PO2", "PO3"]

/**
 * Ballast mass [kg] for one design approach. Wind and its uplift are one action (dependent, 6.5.3 (9)P), so both get γ_Q:
 * γ_Q·F_h ≤ (γ_G·(m + G)·g − γ_Q·F_v)·tan δ_k/(γ_φ′·γ_R;h)  →  m = max(0, (γ_Q·(F_h·γ_φ′·γ_R;h/μ + F_v))/(γ_G·g) − G).
 * μ = tan δ_k (characteristic).
 */
export function balastPrzesuwuEc7Kg(
  podejscie: PodejscieEc7,
  silaPoziomaN: number,
  silaPionowaN: number,
  wspolczynnikTarcia: number,
  przyspieszenieZiemskieMS2: number,
  masaWlasnaKg = 0,
): number {
  const w = PODEJSCIA_EC7[podejscie]
  const wymagana = (w.gammaQ * ((silaPoziomaN * w.gammaPhi * w.gammaRh) / wspolczynnikTarcia + silaPionowaN)) / (w.gammaGKorzystne * przyspieszenieZiemskieMS2)
  return Math.max(0, wymagana - masaWlasnaKg)
}

export type PrzesuwEc7 = {
  /** Obwiednia: największy balast ze wszystkich podejść [kg]. */
  balastKg: number
  /** Które podejście daje największy balast (rozstrzyga). */
  podejscie: PodejscieEc7
  /** Balast wg każdego podejścia [kg]. */
  wgPodejsc: Record<PodejscieEc7, number>
}

/** Przesuw wg p. 6.5.3 dla wszystkich czterech kombinacji; wynik = najcięższa. */
export function przesuwEc7(silaPoziomaN: number, silaPionowaN: number, wspolczynnikTarcia: number, przyspieszenieZiemskieMS2: number, masaWlasnaKg = 0): PrzesuwEc7 {
  const wgPodejsc = Object.fromEntries(
    KOLEJNOSC_PODEJSC_EC7.map((p) => [p, balastPrzesuwuEc7Kg(p, silaPoziomaN, silaPionowaN, wspolczynnikTarcia, przyspieszenieZiemskieMS2, masaWlasnaKg)]),
  ) as Record<PodejscieEc7, number>
  const podejscie = KOLEJNOSC_PODEJSC_EC7.reduce((a, b) => (wgPodejsc[b] > wgPodejsc[a] ? b : a))
  return { balastKg: wgPodejsc[podejscie], podejscie, wgPodejsc }
}

export type RodzajPodstawy = "prefabrykat" | "wylewany"

/** Ułamek kąta φ′_cv przyjmowany jako kąt tarcia podstawa–grunt, p. 6.5.3 (10). */
export const UlamekKataTarcia: Record<RodzajPodstawy, number> = { prefabrykat: 2 / 3, wylewany: 1 }

/**
 * μ = tan δ_k z charakterystycznego kąta tarcia gruntu w stanie krytycznym φ′_cv [°]: δ = 2/3·φ′_cv (gładki prefabrykat, np. bloczki)
 * albo φ′_cv (beton formowany na gruncie), p. 6.5.3 (10). Kąt φ′_cv pochodzi z dokumentacji geotechnicznej użytkownika — norma nie
 * podaje go dla konkretnego gruntu. `null` poza zakresem 0–90° (wyłącznie).
 */
export function wspolczynnikTarciaZKataGruntu(phiCvDeg: number, rodzaj: RodzajPodstawy): number | null {
  if (!Number.isFinite(phiCvDeg) || phiCvDeg <= 0 || phiCvDeg >= 90) return null
  return Math.tan((UlamekKataTarcia[rodzaj] * phiCvDeg * Math.PI) / 180)
}
