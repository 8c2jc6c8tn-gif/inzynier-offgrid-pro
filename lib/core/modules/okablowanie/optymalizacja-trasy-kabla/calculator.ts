import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { isComputed } from "@/lib/core/calc-result"
import type { OptymalizacjaTrasyKablaInput, TrasaInput } from "./input"
import { validateInput } from "./validation"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"
import { porownanieKosztow, trasaNieSpelniaWymagan } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type OptymalizacjaTrasyKablaResult = {
  strataRocznaAKwh: number
  strataRocznaBKwh: number
  tcoAZl: number
  tcoBZl: number
}

const FORMULA = "TCO = koszt_{zakup} + strata_{roczna\\,kWh} \\times lata \\times cena_{kWh}"

function pusty(): OptymalizacjaTrasyKablaResult {
  return { strataRocznaAKwh: 0, strataRocznaBKwh: 0, tcoAZl: 0, tcoBZl: 0 }
}

function echoTrasa(
  trasa: TrasaInput,
  input: OptymalizacjaTrasyKablaInput,
): ReturnType<typeof calculateDoborPrzekrojuKabla> {
  return calculateDoborPrzekrojuKabla({
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    dlugoscTrasyM: trasa.dlugoscTrasyM,
    material: input.material,
    sposobUlozenia: input.sposobUlozenia,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    sprawdzanyPrzekrojMm2: trasa.przekrojMm2,
  })
}

/**
 * Ekran 26, Moduł 5 "Okablowanie i zabezpieczenia" — "Optymalizacja trasy i kosztu kabla" (dawne
 * 4.33, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec echo — TCO dwóch tras liczony
 * na bazie REALNYCH, normatywnych strat rocznych z `calculateDoborPrzekrojuKabla` (M5/Ekran 1,
 * tryb "sprawdź mój przekrój"), nie uproszczonym wzorem wymyślonym od nowa. Przykładowe liczby
 * źródła ("Trasa A 20kWh/rok, Trasa B 45kWh/rok") są ilustracyjne i nie podają, jakim prądem/
 * napięciem/materiałem zostały policzone — nie odtwarzane 1:1, zamiast tego silnik liczy własne,
 * spójne wartości z podanych przez użytkownika parametrów obwodu (ten sam obwód, dwie trasy).
 */
export function calculateOptymalizacjaTrasyKabla(
  input: OptymalizacjaTrasyKablaInput,
): CalcResult<OptymalizacjaTrasyKablaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    cenaEnergiiZlZaKwh: input.cenaEnergiiZlZaKwh,
    liczbaLat: input.liczbaLat,
    trasaADlugoscM: input.trasaA.dlugoscTrasyM,
    trasaAPrzekrojMm2: input.trasaA.przekrojMm2,
    trasaAKosztZl: input.trasaA.kosztZakupuZl,
    trasaBDlugoscM: input.trasaB.dlugoscTrasyM,
    trasaBPrzekrojMm2: input.trasaB.przekrojMm2,
    trasaBKosztZl: input.trasaB.kosztZakupuZl,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "zł",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.pradA === 0 ||
    input.napiecieV === 0 ||
    input.temperaturaOtoczeniaC === null ||
    input.dopuszczalnySpadekNapieciaPct === 0 ||
    input.cenaEnergiiZlZaKwh === 0 ||
    input.liczbaLat === 0 ||
    input.trasaA.dlugoscTrasyM === 0 ||
    input.trasaA.przekrojMm2 === 0 ||
    input.trasaA.kosztZakupuZl === 0 ||
    input.trasaB.dlugoscTrasyM === 0 ||
    input.trasaB.przekrojMm2 === 0 ||
    input.trasaB.kosztZakupuZl === 0

  if (niekompletne) {
    return {
      value: pusty(),
      unit: "zł",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const echoA = echoTrasa(input.trasaA, input)
  const echoB = echoTrasa(input.trasaB, input)

  const najgorszyStatus = (a: Status, b: Status): Status => {
    if (a === "INVALID_INPUT" || b === "INVALID_INPUT") return "INVALID_INPUT"
    if (a === "OUT_OF_SCOPE" || b === "OUT_OF_SCOPE") return "OUT_OF_SCOPE"
    if (a === "INCOMPLETE" || b === "INCOMPLETE") return "INCOMPLETE"
    return "VALID"
  }
  const wspolnyStatus = najgorszyStatus(echoA.status, echoB.status)

  if (!isComputed(wspolnyStatus)) {
    return {
      value: pusty(),
      unit: "zł",
      status: wspolnyStatus,
      formula: FORMULA,
      inputs,
      assumptions: [
        "Wynik zależy od echa `calculateDoborPrzekrojuKabla` dla obu tras — jedna z tras zwróciła status, który uniemożliwia dalsze wyliczenie (patrz ostrzeżenia).",
      ],
      warnings: [...echoA.warnings, ...echoB.warnings],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const strataRocznaAKwh = echoA.value.strataRocznaKwh
  const strataRocznaBKwh = echoB.value.strataRocznaKwh

  const warnings: Warning[] = []
  const echoAKrytyczne = echoA.warnings.filter((w) => w.level === "critical")
  const echoBKrytyczne = echoB.warnings.filter((w) => w.level === "critical")
  for (const w of echoAKrytyczne) warnings.push(trasaNieSpelniaWymagan("A", w.message))
  for (const w of echoBKrytyczne) warnings.push(trasaNieSpelniaWymagan("B", w.message))

  // Jeśli którakolwiek trasa nie spełnia normy (za mały przekrój), echo M5/E1 celowo zwraca
  // strataRocznaKwh=0 dla tej trasy (nie liczy straty dla niezgodnego przekroju) — porównanie
  // kosztów byłoby wtedy mylące (niezgodna trasa wyglądałaby fałszywie "tańsza"). Zamiast tego
  // pokazujemy tylko krytyczne ostrzeżenie, bez TCO, dopóki obie trasy nie spełniają wymagań.
  const obieTrasySpelniajaWymagania = echoAKrytyczne.length === 0 && echoBKrytyczne.length === 0

  let tcoAZl = 0
  let tcoBZl = 0
  if (obieTrasySpelniajaWymagania) {
    tcoAZl = input.trasaA.kosztZakupuZl + strataRocznaAKwh * input.liczbaLat * input.cenaEnergiiZlZaKwh
    tcoBZl = input.trasaB.kosztZakupuZl + strataRocznaBKwh * input.liczbaLat * input.cenaEnergiiZlZaKwh
    const tanszaTrasa = tcoAZl <= tcoBZl ? "A" : "B"
    const roznicaZl = Math.abs(tcoAZl - tcoBZl)
    warnings.push(porownanieKosztow(tanszaTrasa, roznicaZl, input.liczbaLat))
  }

  const maKrytyczne = warnings.some((w) => w.level === "critical")

  return {
    value: { strataRocznaAKwh, strataRocznaBKwh, tcoAZl, tcoBZl },
    unit: "zł",
    status: maKrytyczne ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Straty roczne liczone przez echo `calculateDoborPrzekrojuKabla` (M5/Ekran 1, tryb 'sprawdź mój przekrój') — normatywne (PN-HD 60364-5-52), nie wymyślone od nowa.",
      "Koszt zakupu (kabel + osłony + robocizna) wpisywany jako jedna suma na trasę, tak jak w przykładzie źródła.",
      ...(obieTrasySpelniajaWymagania
        ? []
        : [
            "Porównanie kosztów (TCO) NIE pokazane — co najmniej jedna trasa nie spełnia wymagań przekroju (echo zwraca stratę 0 dla niezgodnego przekroju, co fałszywie zaniżałoby jej koszt). Popraw przekrój trasy oznaczonej jako niespełniającą wymagań.",
          ]),
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
