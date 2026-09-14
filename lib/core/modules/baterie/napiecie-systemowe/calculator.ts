import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { NapiecieSystemoweInput } from "./input"
import { validateInput } from "./validation"
import {
  rekomendacjaNapiecia,
  konfliktJednoczesnosci,
  ogrzewanieWymaga48V,
  pradWysokiPrzy12V,
  pulapkaKonwersji24Do48,
} from "./warnings"
import { PROG_12V_MAX_W, PROG_48V_MIN_W, KATALOG_ODBIORNIKOW } from "./constants"
import { analizaJednoczesnosci, type OdbiornikDoAnalizy } from "./jednoczesnosc"
import { obliczKosztorys, obliczKosztKonwersji24Do48, type KosztorysWynik } from "./kosztorys"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"

export const CALCULATOR_VERSION = "2.1.0"

export type KabelPorownanie = {
  przekrojMm2: number
  obciazalnoscEfektywnaA: number
  spadekNapieciaPct: number
  strataRocznaKwh: number
  status: Status
  warnings: Warning[]
}

export type NapiecieSystemoweResult = {
  napiecieRekomendowaneV: 12 | 24 | 48
  pradPrzy12VA: number
  pradPrzy24VA: number
  pradPrzy48VA: number
  mocSzczytowaCalkowitaW: number
  jednoczesnosc: ReturnType<typeof analizaJednoczesnosci> | null
  kable: { v12: KabelPorownanie; v24: KabelPorownanie; v48: KabelPorownanie } | null
  kosztorysy: { v12: KosztorysWynik; v24: KosztorysWynik; v48: KosztorysWynik } | null
  kosztKonwersji24Do48Zl: number | null
}

const FORMULA = "I = P / V \\;\\; ; \\;\\; P>3000W \\to 48V \\;\\; P<1000W \\to 12V \\;\\; inaczej \\to 24V"

function pustyWynik(): NapiecieSystemoweResult {
  return {
    napiecieRekomendowaneV: 24,
    pradPrzy12VA: 0,
    pradPrzy24VA: 0,
    pradPrzy48VA: 0,
    mocSzczytowaCalkowitaW: 0,
    jednoczesnosc: null,
    kable: null,
    kosztorysy: null,
    kosztKonwersji24Do48Zl: null,
  }
}

function echoKabelDlaNapiecia(napiecieV: number, pradA: number, input: NapiecieSystemoweInput): KabelPorownanie {
  const echo = calculateDoborPrzekrojuKabla({
    pradA,
    napiecieV,
    dlugoscTrasyM: input.dlugoscTrasyM,
    material: input.material,
    sposobUlozenia: input.sposobUlozenia,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    sprawdzanyPrzekrojMm2: null,
  })
  return {
    przekrojMm2: echo.value.przekrojMm2,
    obciazalnoscEfektywnaA: echo.value.obciazalnoscEfektywnaA,
    spadekNapieciaPct: echo.value.spadekNapieciaPct,
    strataRocznaKwh: echo.value.strataRocznaKwh,
    status: echo.status,
    warnings: echo.warnings,
  }
}

/**
 * Ekran 2, Moduł 4 "Magazyn energii / baterie" — "Doradca doboru napięcia systemowego". Wersja
 * 2.0.0: rdzeń I=P/V (Etap "historyczny", wzór i progi niezmienione od 1.0.0) rozbudowany o
 * materiał źródłowy "Dobór napięcia systemu Off-Grid v3.0" (docs/zrodla/Material_Nowy_Modul_...),
 * poprawiony w 4 rundach zamkniętych 13.09.2026 (docs/memory.md). Zasada nadrzędna zastosowana
 * wszędzie: gdziekolwiek aplikacja ma już precyzyjniejszy kalkulator niż uproszczenie źródła —
 * echo tego kalkulatora wygrywa (Etap C→M5/E1 dobor-przekroju-kabla), zamiast duplikowania
 * nienormatywnych wzorów źródła.
 *
 * Wersja 2.1.0 (14.09.2026, zgłoszenie użytkownika): usunięto Etapy D/F/G — nie odpowiadały na
 * pytanie tego ekranu ("jakie napięcie systemowe wybrać"), tylko przykleiły się przy kolejnych
 * rundach rozbudowy. Etap D (oświetlenie/gniazda DC) przenosi się do przyszłego modułu
 * "Oświetlenie" (dane zachowane w constants.ts, oznaczone). Etap F (łączenie pakietów) i Etap G
 * (dobór PV do falownika VEVOR) usunięte całkowicie — pierwsze tylko duplikowało odnośnik do już
 * istniejącego `szyny-zbiorcze-miedzypakietowe`, drugie dotyczyło osobnej decyzji pokrytej przez
 * `dopasowanie-tablicy-falownika` (M3/E14). Zobacz docs/memory.md.
 */
export function calculateNapiecieSystemowe(input: NapiecieSystemoweInput): CalcResult<NapiecieSystemoweResult> {
  const { errors } = validateInput(input)

  const odbiornikiWybrane: OdbiornikDoAnalizy[] = input.odbiorniki
    .filter((o) => o.selected && o.mocW > 0)
    .map((o) => {
      const katalogowy = KATALOG_ODBIORNIKOW.find((k) => k.id === o.id)
      return {
        id: o.id,
        label: katalogowy?.label ?? o.id,
        mocW: o.mocW,
        czasPracyMin: o.czasPracyMin,
        bazowy: katalogowy?.bazowy ?? false,
      }
    })
  const sumaOdbiornikowW = odbiornikiWybrane.reduce((s, o) => s + o.mocW, 0)
  const mocSzczytowaCalkowitaW =
    input.mocSzczytowaW > 0 ? input.mocSzczytowaW : sumaOdbiornikowW + (input.ogrzewanieNieDotyczy ? 0 : input.ogrzewanieMocW)

  const inputs = {
    mocSzczytowaW: input.mocSzczytowaW,
    mocSzczytowaCalkowitaW,
    ogrzewanieMocW: input.ogrzewanieMocW,
    mocCiaglaFalownikaPlanowanaW: input.mocCiaglaFalownikaPlanowanaW,
    dlugoscTrasyM: input.dlugoscTrasyM,
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC ?? 0,
    liczbaKabliWWiazce: input.liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct: input.dopuszczalnySpadekNapieciaPct,
    docelowaPojemnoscKwh: input.docelowaPojemnoscKwh,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik(),
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (mocSzczytowaCalkowitaW === 0) {
    return {
      value: pustyWynik(),
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const napiecieRekomendowaneV: 12 | 24 | 48 =
    mocSzczytowaCalkowitaW > PROG_48V_MIN_W ? 48 : mocSzczytowaCalkowitaW < PROG_12V_MAX_W ? 12 : 24

  const pradPrzy12VA = mocSzczytowaCalkowitaW / 12
  const pradPrzy24VA = mocSzczytowaCalkowitaW / 24
  const pradPrzy48VA = mocSzczytowaCalkowitaW / 48

  const warnings: Warning[] = [rekomendacjaNapiecia(napiecieRekomendowaneV)]

  // Etap B.2/B.3 — analiza jednoczesności (tylko gdy kreator odbiorników użyty).
  const jednoczesnosc = odbiornikiWybrane.length > 0 ? analizaJednoczesnosci(odbiornikiWybrane, input.mocCiaglaFalownikaPlanowanaW) : null
  if (jednoczesnosc?.konflikt && jednoczesnosc.wagaOstrzezenia) {
    warnings.push(
      konfliktJednoczesnosci(
        jednoczesnosc.sumaWorstCaseW,
        input.mocCiaglaFalownikaPlanowanaW,
        jednoczesnosc.wagaOstrzezenia,
        jednoczesnosc.sugerowaneWylaczenie.map((o) => o.label),
      ),
    )
  }

  // Etap C.1 (tabela decyzyjna) — ogrzewanie elektryczne a rekomendowane napięcie.
  const mocOgrzewaniaLaczna =
    (input.ogrzewanieNieDotyczy ? 0 : input.ogrzewanieMocW) +
    odbiornikiWybrane.filter((o) => o.id === "kociol-elektryczny" || o.id === "promiennik" || o.id === "pompa-ciepla").reduce((s, o) => s + o.mocW, 0)
  if (mocOgrzewaniaLaczna > 0 && napiecieRekomendowaneV < 48) {
    warnings.push(ogrzewanieWymaga48V(napiecieRekomendowaneV, mocOgrzewaniaLaczna))
  }

  // Etap C.3 — prąd rzędu spawarki przy 12V.
  if (pradPrzy12VA > 100) {
    warnings.push(pradWysokiPrzy12V(pradPrzy12VA))
  }

  // Etap C — echo dobor-przekroju-kabla ×3.
  const kable =
    input.dlugoscTrasyM > 0
      ? {
          v12: echoKabelDlaNapiecia(12, pradPrzy12VA, input),
          v24: echoKabelDlaNapiecia(24, pradPrzy24VA, input),
          v48: echoKabelDlaNapiecia(48, pradPrzy48VA, input),
        }
      : null

  // Etap E — kosztorysy ×3 (dla tej samej docelowej pojemności).
  const kosztorysy =
    input.docelowaPojemnoscKwh > 0
      ? {
          v12: obliczKosztorys(
            12,
            input.docelowaPojemnoscKwh * 1000,
            {
              cenaOgniwaZl: input.cenaOgniwaZl,
              cenaBmsZl: input.cenaBms4sZl,
              cenaFalownikaZl: input.cenaFalownika12vZl,
              cenaPrzewodowZl: input.cenaPrzewodow12vZl,
              cenaBezpiecznikaZl: input.cenaBezpiecznika12vZl,
              cenaPrzetwornicyDcDcZl: input.cenaPrzetwornicyDcDcZl,
            },
            0,
          ),
          v24: obliczKosztorys(
            24,
            input.docelowaPojemnoscKwh * 1000,
            {
              cenaOgniwaZl: input.cenaOgniwaZl,
              cenaBmsZl: input.cenaBms8sZl,
              cenaFalownikaZl: input.cenaFalownika24vZl,
              cenaPrzewodowZl: input.cenaPrzewodow24vZl,
              cenaBezpiecznikaZl: input.cenaBezpiecznika24vZl,
              cenaPrzetwornicyDcDcZl: input.cenaPrzetwornicyDcDcZl,
            },
            0,
          ),
          v48: obliczKosztorys(
            48,
            input.docelowaPojemnoscKwh * 1000,
            {
              cenaOgniwaZl: input.cenaOgniwaZl,
              cenaBmsZl: input.cenaBms16sZl,
              cenaFalownikaZl: input.cenaFalownika48vZl,
              cenaPrzewodowZl: input.cenaPrzewodow48vZl,
              cenaBezpiecznikaZl: input.cenaBezpiecznika48vZl,
              cenaPrzetwornicyDcDcZl: input.cenaPrzetwornicyDcDcZl,
            },
            input.liczbaLiniiOswietlenia24vPrzySystemie48v,
          ),
        }
      : null
  if (kable) {
    // Kody ostrzeżeń echa kabla NIE są unikalne między 12/24/48V (np. "brak pasującego
    // przekroju" może wystąpić dla dwóch napięć naraz) — a `code` służy w UI jako klucz listy
    // (WynikSzczegoly), więc tagujemy napięciem, inaczej React dostaje zduplikowany klucz.
    const napiecia: [12 | 24 | 48, KabelPorownanie][] = [
      [12, kable.v12],
      [24, kable.v24],
      [48, kable.v48],
    ]
    for (const [v, k] of napiecia) {
      for (const w of k.warnings.filter((w) => w.level !== "info")) {
        warnings.push({ ...w, code: `${w.code}-${v}V` })
      }
    }
  }

  // Etap H — pułapka konwersji 24V→48V (reużywa cen z Etapu E).
  const kosztKonwersji24Do48Zl = input.planowanaKonwersja24Do48
    ? obliczKosztKonwersji24Do48({
        cenaBmsZl: input.cenaBms16sZl,
        cenaFalownikaZl: input.cenaFalownika48vZl,
        cenaPrzewodowZl: input.cenaPrzewodow48vZl,
      })
    : null
  if (input.planowanaKonwersja24Do48) {
    warnings.push(pulapkaKonwersji24Do48())
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: {
      napiecieRekomendowaneV,
      pradPrzy12VA,
      pradPrzy24VA,
      pradPrzy48VA,
      mocSzczytowaCalkowitaW,
      jednoczesnosc,
      kable,
      kosztorysy,
      kosztKonwersji24Do48Zl,
    },
    unit: "V",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Pasmo 1000-3000W → 24V dopowiedziane logicznie ze struktury 12/24/48V (źródło podaje wprost tylko progi <1000W i >3000W).",
      "Moc szczytowa = suma zaznaczonych odbiorników (Etap B) + moc ogrzewania (Etap A), chyba że wpisano ręczne pole 'Obciążenie szczytowe' — wtedy ono nadpisuje sumę z kreatora.",
      "Etap B.2 (konflikt jednoczesności) sprawdzany tylko gdy podano planowaną moc ciągłą falownika — bez niej nie ma z czym porównać sumy 'worst case'.",
      "Etap C: przekrój/spadek napięcia/straty roczne liczone przez echo M5/Ekran1 (norma PN-HD 60364-5-52), nie przez uproszczony wzór P=I²R z materiału źródłowego.",
      "Etap E: kosztorysy dla TEJ SAMEJ docelowej pojemności energetycznej u wszystkich trzech napięć (poprawne porównanie wg źródła, nie naiwne porównanie tą samą liczbą ogniw). Koszt BMS liczony jako jedna sztuka niezależnie od liczby równoległych stringów — zgodnie z literalnymi tabelami źródła.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
