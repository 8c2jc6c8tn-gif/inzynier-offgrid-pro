import type { CalcResult } from "@/lib/core/calc-result"
import type { DoborPrzekrojuKablaInput } from "./input"
import { validateInput } from "./validation"
import {
  brakPasujacegoPrzekroju,
  dopuszczalnyNaGranicy,
  liczbaKabliPozaZakresem,
  przekrojPonizejWyliczonego,
  temperaturaPozaZakresem,
  zalecanyZMarginesem,
} from "./warnings"
import {
  OBCIAZALNOSC_BAZOWA_A,
  PROG_MARGINESU_ZALECANE_PCT,
  PRZEKROJE_MM2,
  REZYSTYWNOSC_ALUMINIUM_OHM_MM2_NA_M,
  REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M,
  WSPOLCZYNNIK_TEMP_GRUNT_PVC,
  WSPOLCZYNNIK_TEMP_POWIETRZE_PVC,
  WSPOLCZYNNIK_WIAZKA_GRUNT,
  WSPOLCZYNNIK_WIAZKA_METODA_B,
  WSPOLCZYNNIK_WIAZKA_METODA_C,
  type Material,
  type SposobUlozenia,
} from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "I_z = I_{tabelaryczne} \\times k_1 \\times k_2 \\;\\; ; \\;\\; \\Delta U\\% = \\frac{I \\times \\rho \\times 2L / S}{U} \\times 100"

export type DoborPrzekrojuKablaResult = {
  /** Dobrany (lub sprawdzany) przekrój [mm²]. 0 = brak pasującego. */
  przekrojMm2: number
  /** Obciążalność efektywna po korektach [A]. */
  obciazalnoscEfektywnaA: number
  /** Spadek napięcia dla dobranego przekroju [%]. */
  spadekNapieciaPct: number
  /** Margines obciążalności [%] — (I_z − I) / I × 100. */
  marginesObciazalnosciPct: number
  /** Margines spadku napięcia [%] — (próg − ΔU%) / próg × 100. */
  marginesSpadkuPct: number
  /** Roczna strata energii w kablu [kWh/rok] — I²×R×godziny_pracy z założeniem pracy ciągłej (8760h),
   *  do orientacyjnej kalkulacji kosztowej z Sekcji C, nie twardy wynik bezpieczeństwa. */
  strataRocznaKwh: number
}

/** Liniowa interpolacja pomiędzy punktami tabeli; null jeśli x poza zakresem (nie ekstrapoluje). */
function interpolujZTablicy(tabela: readonly (readonly [number, number])[], x: number): number | null {
  if (x < tabela[0][0] || x > tabela[tabela.length - 1][0]) return null
  for (let i = 0; i < tabela.length - 1; i++) {
    const [x0, y0] = tabela[i]
    const [x1, y1] = tabela[i + 1]
    if (x >= x0 && x <= x1) {
      if (x1 === x0) return y0
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    }
  }
  return null
}

function rezystywnosc(material: Material): number {
  return material === "Cu" ? REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M : REZYSTYWNOSC_ALUMINIUM_OHM_MM2_NA_M
}

function obciazalnoscBazowaA(material: Material, przekrojMm2: number, sposobUlozenia: SposobUlozenia): number | null {
  const wpis = OBCIAZALNOSC_BAZOWA_A[material][przekrojMm2]
  if (!wpis) return null
  if (sposobUlozenia === "w_ziemi") return wpis.D
  if (sposobUlozenia === "w_peszlu") return wpis.B2
  return wpis.C // swobodnie, w_wiazce
}

/** k1 — korekta temperaturowa. null = temperatura poza zakresem tabel normy dla PVC. */
function wspolczynnikTemperatury(sposobUlozenia: SposobUlozenia, temperaturaC: number): number | null {
  const tabela = sposobUlozenia === "w_ziemi" ? WSPOLCZYNNIK_TEMP_GRUNT_PVC : WSPOLCZYNNIK_TEMP_POWIETRZE_PVC
  return interpolujZTablicy(tabela, temperaturaC)
}

/** k2 — korekta wiązki. null = liczba kabli poza zakresem tabeli (dla metody). undefined-safe: 1 kabel → 1,00. */
function wspolczynnikWiazki(sposobUlozenia: SposobUlozenia, liczbaKabli: number): number | null {
  if (liczbaKabli <= 1) return 1
  if (sposobUlozenia === "w_ziemi") return interpolujZTablicy(WSPOLCZYNNIK_WIAZKA_GRUNT, liczbaKabli)
  if (sposobUlozenia === "w_peszlu") return interpolujZTablicy(WSPOLCZYNNIK_WIAZKA_METODA_B, liczbaKabli)
  return interpolujZTablicy(WSPOLCZYNNIK_WIAZKA_METODA_C, liczbaKabli) // swobodnie, w_wiazce
}

function spadekNapieciaPct(
  pradA: number,
  napiecieV: number,
  dlugoscTrasyM: number,
  przekrojMm2: number,
  material: Material,
): number {
  const rezystancjaOhm = (rezystywnosc(material) * 2 * dlugoscTrasyM) / przekrojMm2
  const spadekV = pradA * rezystancjaOhm
  return (spadekV / napiecieV) * 100
}

function pustyWynik(): DoborPrzekrojuKablaResult {
  return {
    przekrojMm2: 0,
    obciazalnoscEfektywnaA: 0,
    spadekNapieciaPct: 0,
    marginesObciazalnosciPct: 0,
    marginesSpadkuPct: 0,
    strataRocznaKwh: 0,
  }
}

/**
 * Ekran 1, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór przekroju kabla" (mega-Doradca, dawne
 * 4.1/4.18/4.27/4.30, `docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md`). Jeden dobór z trzema
 * poprawkami naraz (obciążalność bazowa × korekta temperatury × korekta wiązki, sprawdzenie
 * spadku napięcia), 1:1 z Sekcji B źródła — tabele normatywne z PN-HD 60364-5-52 (patrz
 * `constants.ts` po pełne uzasadnienie wyborów kolumn/metod).
 *
 * **Rozbieżność znaleziona i udokumentowana** (nie ukryta): źródło podaje wzór spadku napięcia
 * `ΔU = I×R, R=ρ×L/S` (bez ×2), co pomija drogę powrotną prądu. Ten kalkulator używa `R=ρ×2L/S` —
 * ten sam, fizycznie poprawny wzór co już zweryfikowany `straty-okablowanie-dc` (Moduł 3/Ekran 8).
 */
export function calculateDoborPrzekrojuKabla(
  input: DoborPrzekrojuKablaInput,
): CalcResult<DoborPrzekrojuKablaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    dlugoscTrasyM: input.dlugoscTrasyM,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC ?? 0,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    sprawdzanyPrzekrojMm2: input.sprawdzanyPrzekrojMm2 ?? 0,
  }
  const assumptions = [
    "Izolacja żył założona jako PVC (70°C) — dane wejściowe nie proszą o typ izolacji; PVC ma niższą obciążalność niż XLPE/EPR, więc jest zachowawczym (bezpieczniejszym) wyborem domyślnym.",
    "Liczba żył obciążonych w obwodzie = 2 (obwód DC lub jednofazowy AC) — użyto Tablicy B.52.2 normy PN-HD 60364-5-52.",
    "Rezystancja pętli liczona jako ρ×2×L/S (prąd wraca drugim przewodem) — tak jak w już zweryfikowanym kalkulatorze M3/E8 (straty-okablowanie-dc); uproszczony wzór ze źródła tego ekranu (bez ×2) zaniżałby spadek napięcia o połowę.",
    "Korekta sposobu ułożenia zrealizowana przez wybór właściwej kolumny tabeli normy (metoda referencyjna C/B2/D), nie przez osobny mnożnik k3 opisany w źródle produktowym — norma nie definiuje takiego wspólnego współczynnika.",
  ]

  if (errors.length > 0) {
    return {
      value: pustyWynik(),
      unit: "mm²",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.pradA === 0 ||
    input.napiecieV === 0 ||
    input.dlugoscTrasyM === 0 ||
    input.temperaturaOtoczeniaC === null ||
    input.dopuszczalnySpadekNapieciaPct === 0

  if (niekompletne) {
    return {
      value: pustyWynik(),
      unit: "mm²",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const temperaturaC: number = input.temperaturaOtoczeniaC ?? 0
  const k1 = wspolczynnikTemperatury(input.sposobUlozenia, temperaturaC)
  if (k1 === null) {
    return {
      value: pustyWynik(),
      unit: "mm²",
      status: "OUT_OF_SCOPE",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings: [temperaturaPozaZakresem(temperaturaC)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const k2 = wspolczynnikWiazki(input.sposobUlozenia, input.liczbaKabliWWiazce)
  if (k2 === null) {
    return {
      value: pustyWynik(),
      unit: "mm²",
      status: "OUT_OF_SCOPE",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings: [liczbaKabliPozaZakresem(input.liczbaKabliWWiazce)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const przekroje = PRZEKROJE_MM2[input.material]
  const k1Wybrany: number = k1
  const k2Wybrany: number = k2

  function oceńPrzekroj(przekrojMm2: number) {
    const bazowaA = obciazalnoscBazowaA(input.material, przekrojMm2, input.sposobUlozenia)
    if (bazowaA === null) return null
    const efektywnaA = bazowaA * k1Wybrany * k2Wybrany
    const spadekPct = spadekNapieciaPct(input.pradA, input.napiecieV, input.dlugoscTrasyM, przekrojMm2, input.material)
    const obciazalnoscOk = input.pradA <= efektywnaA
    const spadekOk = spadekPct <= input.dopuszczalnySpadekNapieciaPct
    const marginesObciazalnosciPct = ((efektywnaA - input.pradA) / input.pradA) * 100
    const marginesSpadkuPct = ((input.dopuszczalnySpadekNapieciaPct - spadekPct) / input.dopuszczalnySpadekNapieciaPct) * 100
    return { przekrojMm2, efektywnaA, spadekPct, obciazalnoscOk, spadekOk, marginesObciazalnosciPct, marginesSpadkuPct }
  }

  // Tryb "sprawdź mój przekrój" (Sekcja B, werdykt 🔴).
  if (input.sprawdzanyPrzekrojMm2 !== null) {
    const sprawdzany = oceńPrzekroj(input.sprawdzanyPrzekrojMm2)
    // Najmniejszy przekrój spełniający oba kryteria — do porównania i komunikatu.
    const wymagany = przekroje.map(oceńPrzekroj).find((w) => w && w.obciazalnoscOk && w.spadekOk)

    if (!sprawdzany || !sprawdzany.obciazalnoscOk || !sprawdzany.spadekOk) {
      const wymaganyMm2 = wymagany ? wymagany.przekrojMm2 : przekroje[przekroje.length - 1]
      return {
        value: {
          przekrojMm2: input.sprawdzanyPrzekrojMm2,
          obciazalnoscEfektywnaA: sprawdzany?.efektywnaA ?? 0,
          spadekNapieciaPct: sprawdzany?.spadekPct ?? 0,
          marginesObciazalnosciPct: sprawdzany?.marginesObciazalnosciPct ?? 0,
          marginesSpadkuPct: sprawdzany?.marginesSpadkuPct ?? 0,
          strataRocznaKwh: 0,
        },
        unit: "mm²",
        status: "VALID_WITH_WARNINGS",
        formula: FORMULA,
        inputs,
        assumptions,
        warnings: [przekrojPonizejWyliczonego(input.sprawdzanyPrzekrojMm2, wymaganyMm2)],
        calculatorVersion: CALCULATOR_VERSION,
      }
    }

    const zalecane =
      sprawdzany.marginesObciazalnosciPct >= PROG_MARGINESU_ZALECANE_PCT &&
      sprawdzany.marginesSpadkuPct >= PROG_MARGINESU_ZALECANE_PCT
    const warnings = zalecane
      ? [zalecanyZMarginesem(sprawdzany.marginesObciazalnosciPct, sprawdzany.marginesSpadkuPct)]
      : [dopuszczalnyNaGranicy(sprawdzany.marginesObciazalnosciPct, sprawdzany.marginesSpadkuPct)]

    const rezystancjaSprawdzanegoOhm =
      (rezystywnosc(input.material) * 2 * input.dlugoscTrasyM) / sprawdzany.przekrojMm2
    const strataRocznaSprawdzanegoKwh = (input.pradA * input.pradA * rezystancjaSprawdzanegoOhm * 8760) / 1000

    return {
      value: {
        przekrojMm2: sprawdzany.przekrojMm2,
        obciazalnoscEfektywnaA: sprawdzany.efektywnaA,
        spadekNapieciaPct: sprawdzany.spadekPct,
        marginesObciazalnosciPct: sprawdzany.marginesObciazalnosciPct,
        marginesSpadkuPct: sprawdzany.marginesSpadkuPct,
        strataRocznaKwh: strataRocznaSprawdzanegoKwh,
      },
      unit: "mm²",
      status: zalecane ? "VALID" : "VALID_WITH_WARNINGS",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  // Tryb automatyczny — dobór najmniejszego pasującego przekroju.
  const najlepszy = przekroje.map(oceńPrzekroj).find((w) => w && w.obciazalnoscOk && w.spadekOk)

  if (!najlepszy) {
    return {
      value: pustyWynik(),
      unit: "mm²",
      status: "OUT_OF_SCOPE",
      formula: FORMULA,
      inputs,
      assumptions,
      warnings: [brakPasujacegoPrzekroju(przekroje[przekroje.length - 1])],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const zalecane =
    najlepszy.marginesObciazalnosciPct >= PROG_MARGINESU_ZALECANE_PCT &&
    najlepszy.marginesSpadkuPct >= PROG_MARGINESU_ZALECANE_PCT
  const warnings = zalecane
    ? [zalecanyZMarginesem(najlepszy.marginesObciazalnosciPct, najlepszy.marginesSpadkuPct)]
    : [dopuszczalnyNaGranicy(najlepszy.marginesObciazalnosciPct, najlepszy.marginesSpadkuPct)]

  const rezystancjaOhm = (rezystywnosc(input.material) * 2 * input.dlugoscTrasyM) / najlepszy.przekrojMm2
  const strataRocznaKwh = (input.pradA * input.pradA * rezystancjaOhm * 8760) / 1000

  return {
    value: {
      przekrojMm2: najlepszy.przekrojMm2,
      obciazalnoscEfektywnaA: najlepszy.efektywnaA,
      spadekNapieciaPct: najlepszy.spadekPct,
      marginesObciazalnosciPct: najlepszy.marginesObciazalnosciPct,
      marginesSpadkuPct: najlepszy.marginesSpadkuPct,
      strataRocznaKwh,
    },
    unit: "mm²",
    status: zalecane ? "VALID" : "VALID_WITH_WARNINGS",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
