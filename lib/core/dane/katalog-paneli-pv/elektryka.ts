/**
 * Dane elektryczne paneli katalogu (D81, Etap A3): Voc, Vmp, Isc, Imp w STC, współczynnik temperaturowy Voc (β), maks. napięcie układu i maks. bezpiecznik
 * szeregowy — przepisane z tabel STC kart katalogowych (transkrypcje w `docs/zrodla/karta-katalogowa-*`), wiersz w kolejności [Voc, Vmp, Isc, Imp].
 * Wartości z kart bez czytelnego parametru to `null`. Spójność liczb (Vmp·Imp ≈ Pmax, Voc > Vmp, Isc > Imp) pilnuje test katalogu.
 */
import type { DaneElektryczne } from "@/lib/core/modules/pv/porownywarka-paneli/input"

type Wiersz = readonly [vocV: number, vmpV: number, iscA: number, impA: number]

type Seria = {
  /** Początek identyfikatora wpisu katalogu; pełny identyfikator = prefiks + moc w W. */
  prefiks: string
  betaVocPctNaC: number
  maxNapieciaSystemuV: number
  maxBezpiecznikSzeregowyA: number | null
  /** Moc [W] → [Voc, Vmp, Isc, Imp] z tabeli STC karty. */
  stc: Readonly<Record<number, Wiersz>>
}

const SERIE: readonly Seria[] = [
  // JA Solar JAM60D41 LB (karta: Voc, Vmp [karta nazywa wiersz „Maksymalne napięcie zasilania” — to Vmp, patrz INDEKS], Isc, Imp w STC; β(Voc) −0,250 %/°C; maks. napięcie układu 1500 V DC; maks. bezpiecznik szeregowy 30 A).
  {
    prefiks: "ja-solar-jam60d41-lb-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      485: [43.25, 36.28, 14.24, 13.37],
      490: [43.45, 36.49, 14.3, 13.43],
      495: [43.65, 36.7, 14.36, 13.49],
      500: [43.85, 36.91, 14.42, 13.55],
      505: [44.05, 37.11, 14.48, 13.61],
      510: [44.25, 37.31, 14.54, 13.67],
    },
  },
  // JA Solar JAM60D40 LB (liczby elektryczne identyczne z JAM60D41 LB; β(Voc) −0,250 %/°C; 1500 V DC; bezpiecznik szeregowy 30 A).
  {
    prefiks: "ja-solar-jam60d40-lb-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      485: [43.25, 36.28, 14.24, 13.37],
      490: [43.45, 36.49, 14.3, 13.43],
      495: [43.65, 36.7, 14.36, 13.49],
      500: [43.85, 36.91, 14.42, 13.55],
      505: [44.05, 37.11, 14.48, 13.61],
      510: [44.25, 37.31, 14.54, 13.67],
    },
  },
  // Astronergy ASTRO N5 CHSM72N(DG)/F-BH (β(Voc) −0,25 %/°C; 1500 V DC; bezpiecznik szeregowy 30 A).
  {
    prefiks: "astronergy-n5-chsm72n-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      570: [50.9, 42.77, 14.1, 13.33],
      575: [51.1, 42.94, 14.19, 13.39],
      580: [51.3, 43.11, 14.28, 13.45],
      585: [51.5, 43.27, 14.36, 13.52],
      590: [51.7, 43.45, 14.45, 13.58],
      595: [51.9, 43.61, 14.53, 13.64],
    },
  },
  // JA Solar JAM54D41 LB (β(Voc) −0,250 %/°C; 1500 V DC; bezpiecznik szeregowy 30 A).
  {
    prefiks: "ja-solar-jam54d41-lb-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      440: [38.9, 32.47, 14.31, 13.55],
      445: [39.1, 32.65, 14.4, 13.63],
      450: [40.3, 32.99, 14.41, 13.64],
      455: [40.5, 33.33, 14.42, 13.65],
      460: [40.6, 33.68, 14.43, 13.66],
      465: [40.7, 34.02, 14.44, 13.67],
    },
  },
  // HD Hyundai HiT-H5xxCF-BF(ZB) — tabela STC strony przedniej (β(Voc) −0,22 %/°C; 1500 V DC; karta podaje „maks. prąd wsteczny 30 A”, wpisany jako maks. bezpiecznik szeregowy).
  {
    prefiks: "hyundai-hit-h5xxcf-bf-zb-",
    betaVocPctNaC: -0.22,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      500: [40.63, 35.14, 15.09, 14.31],
      505: [40.71, 35.22, 15.18, 14.4],
      510: [40.79, 35.3, 15.26, 14.49],
      515: [40.88, 35.48, 15.33, 14.58],
      520: [40.96, 35.56, 15.42, 14.67],
    },
  },
  // JA Solar JAM54D40 LR, jednostronny (β(Voc) −0,250 %/°C; 1500 V DC; bezpiecznik szeregowy 25 A).
  {
    prefiks: "ja-solar-jam54d40-lr-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 25,
    stc: {
      450: [39.3, 32.82, 14.48, 13.71],
      455: [39.5, 33.0, 14.56, 13.79],
      460: [39.7, 33.17, 14.64, 13.87],
      465: [40.2, 33.5, 14.65, 13.88],
      470: [40.4, 33.84, 14.66, 13.89],
      475: [40.55, 34.18, 14.67, 13.9],
    },
  },
  // JA Solar JAM54D40 LB, dwustronny (β(Voc) −0,250 %/°C; 1500 V DC; bezpiecznik szeregowy 30 A).
  {
    prefiks: "ja-solar-jam54d40-lb-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      435: [38.7, 32.29, 14.23, 13.47],
      440: [38.9, 32.47, 14.31, 13.55],
      445: [39.1, 32.65, 14.4, 13.63],
      450: [39.3, 32.82, 14.48, 13.71],
      455: [39.5, 33.0, 14.56, 13.79],
      460: [39.7, 33.17, 14.64, 13.87],
    },
  },
  // JA Solar JAM66D46 LB (690–715 W: karta starsza; 720 W: karta 695–720 W; β(Voc) −0,250 %/°C; 1500 V DC; bezpiecznik szeregowy 35 A).
  {
    prefiks: "ja-solar-jam66d46-lb-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 35,
    stc: {
      690: [47.8, 40.02, 18.35, 17.24],
      695: [48.0, 40.22, 18.39, 17.28],
      700: [48.2, 40.42, 18.43, 17.32],
      705: [48.4, 40.61, 18.47, 17.36],
      710: [48.6, 40.8, 18.51, 17.4],
      715: [48.8, 41.0, 18.55, 17.44],
      720: [49.0, 41.19, 18.59, 17.48],
    },
  },
  // JA Solar JAM72D40 MB (β(Voc) −0,250 %/°C; 1500 V DC; bezpiecznik szeregowy 30 A).
  {
    prefiks: "ja-solar-jam72d40-mb-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      580: [51.95, 44.02, 13.84, 13.17],
      585: [52.16, 44.22, 13.89, 13.23],
      590: [52.37, 44.43, 13.94, 13.28],
      595: [52.58, 44.64, 13.99, 13.33],
      600: [52.79, 44.85, 14.04, 13.38],
      605: [53.0, 45.05, 14.09, 13.43],
    },
  },
  // Jinko Tiger Neo 48HL4M-BDV (β(Voc) −0,25 %/°C; 1500 V DC (IEC); bezpiecznik szeregowy 35 A).
  {
    prefiks: "jinko-tiger-neo-48hl4m-bdv-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 35,
    stc: {
      445: [36.02, 30.3, 15.6, 14.69],
      450: [36.19, 30.53, 15.65, 14.74],
      455: [36.36, 30.77, 15.7, 14.79],
      460: [36.53, 31.0, 15.75, 14.84],
      465: [36.7, 31.23, 15.8, 14.89],
      470: [36.87, 31.46, 15.85, 14.94],
    },
  },
  // Jinko Tiger Neo 66HL4M-BDV 605–630 W (β(Voc) −0,25 %/°C; 1500 V DC (IEC); bezpiecznik szeregowy 35 A).
  {
    prefiks: "jinko-tiger-neo-66hl4m-bdv-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 35,
    stc: {
      605: [48.48, 40.31, 15.9, 15.01],
      610: [48.68, 40.46, 15.96, 15.08],
      615: [48.88, 40.6, 16.02, 15.15],
      620: [49.08, 40.74, 16.08, 15.22],
      625: [49.28, 40.88, 16.14, 15.29],
      630: [49.48, 41.02, 16.2, 15.36],
    },
  },
  // Jinko Tiger Neo 66HL4M-BDV 590–600 W (karta EN/CEC): liczby odczytane z postępu wartości, karta nie podaje bezpiecznika szeregowego (null); β(Voc) −0,25 %/°C; 1500 V DC (IEC).
  {
    prefiks: "jinko-tiger-neo-66hl4m-bdv-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: null,
    stc: {
      590: [47.88, 39.87, 15.72, 14.8],
      595: [48.08, 40.02, 15.78, 14.87],
      600: [48.28, 40.16, 15.84, 14.94],
    },
  },
  // Jinko Tiger Neo 72HL4-BDV 575–600 W (β(Voc) −0,25 %/°C; 1500 V DC (IEC); bezpiecznik szeregowy 30 A).
  {
    prefiks: "jinko-tiger-neo-72hl4-bdv-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      575: [52.3, 43.73, 13.89, 13.15],
      580: [52.5, 43.88, 13.95, 13.22],
      585: [52.7, 44.02, 14.01, 13.29],
      590: [52.9, 44.17, 14.07, 13.36],
      595: [53.1, 44.31, 14.13, 13.43],
      600: [53.3, 44.45, 14.19, 13.5],
    },
  },
  // Jinko Tiger Neo 72HL4-BDV 550–570 W (karta CN): β(Voc) −0,25 %/°C; 1500 V DC (IEC); bezpiecznik szeregowy 30 A.
  {
    prefiks: "jinko-tiger-neo-72hl4-bdv-",
    betaVocPctNaC: -0.25,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 30,
    stc: {
      550: [50.27, 41.58, 14.01, 13.23],
      555: [50.47, 41.77, 14.07, 13.29],
      560: [50.67, 41.95, 14.13, 13.35],
      565: [50.87, 42.14, 14.19, 13.41],
      570: [51.07, 42.29, 14.25, 13.48],
    },
  },
  // LONGi Hi-MO X10 LR7-54HVH (karta „Draft”; β(Voc) −0,200 %/°C; 1500 V DC (IEC); bezpiecznik szeregowy 25 A).
  {
    prefiks: "longi-himo-x10-lr7-54hvh-",
    betaVocPctNaC: -0.2,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 25,
    stc: {
      475: [40.18, 33.16, 15.03, 14.33],
      480: [40.29, 33.28, 15.13, 14.43],
      485: [40.4, 33.4, 15.23, 14.53],
      490: [40.52, 33.51, 15.33, 14.63],
    },
  },
  // LONGi Hi-MO X10 LR7-60HVH (β(Voc) −0,200 %/°C; 1500 V DC (IEC); bezpiecznik szeregowy 25 A).
  {
    prefiks: "longi-himo-x10-lr7-60hvh-",
    betaVocPctNaC: -0.2,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 25,
    stc: {
      535: [44.78, 37.01, 15.15, 14.46],
      540: [44.88, 37.11, 15.25, 14.55],
      545: [44.98, 37.21, 15.35, 14.65],
      550: [45.08, 37.31, 15.45, 14.74],
      555: [45.18, 37.41, 15.55, 14.84],
      560: [45.28, 37.51, 15.65, 14.93],
    },
  },
  // Trina Vertex S+ TSM-NEG9R.28 (β(Voc) −0,24 %/°C; 1500 V DC (IEC); zabezpieczenie prądowe 25 A).
  {
    prefiks: "trina-vertex-s-plus-neg9r28-",
    betaVocPctNaC: -0.24,
    maxNapieciaSystemuV: 1500,
    maxBezpiecznikSzeregowyA: 25,
    stc: {
      430: [51.4, 43.2, 10.59, 9.96],
      435: [51.8, 43.6, 10.64, 9.99],
      440: [52.2, 44.0, 10.67, 10.01],
      445: [52.6, 44.3, 10.71, 10.05],
      450: [52.9, 44.6, 10.74, 10.09],
      455: [53.4, 45.0, 10.77, 10.11],
      460: [53.8, 45.4, 10.81, 10.14],
      465: [54.2, 45.8, 10.85, 10.16],
      470: [54.6, 46.1, 10.89, 10.2],
      475: [55.0, 46.4, 10.93, 10.24],
    },
  },
]

/** Dane elektryczne panelu o danym identyfikatorze katalogu; `null` = brak w tabelach (wpis bez danych elektrycznych). */
export function elektrykaPanelu(id: string): DaneElektryczne | null {
  for (const s of SERIE) {
    if (!id.startsWith(s.prefiks)) continue
    const moc = Number(id.slice(s.prefiks.length))
    const w = s.stc[moc]
    if (w === undefined) continue
    return {
      vocV: w[0],
      vmpV: w[1],
      iscA: w[2],
      impA: w[3],
      betaVocPctNaC: s.betaVocPctNaC,
      maxNapieciaSystemuV: s.maxNapieciaSystemuV,
      maxBezpiecznikSzeregowyA: s.maxBezpiecznikSzeregowyA,
    }
  }
  return null
}
