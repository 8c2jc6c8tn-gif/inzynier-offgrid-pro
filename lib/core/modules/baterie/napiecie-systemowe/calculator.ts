import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { isComputed } from "@/lib/core/calc-result"
import type { NapiecieSystemoweInput } from "./input"
import { validateInput } from "./validation"
import {
  rekomendacjaNapiecia,
  konfliktJednoczesnosci,
  ogrzewanieWymaga48V,
  pradWysokiPrzy12V,
  pulapkaKonwersji24Do48,
} from "./warnings"
import {
  PROG_12V_MAX_W,
  PROG_48V_MIN_W,
  KATALOG_ODBIORNIKOW,
  FALOWNIKI_VEVOR,
  PANEL_JA_SOLAR_500W,
  type FalownikVevorSpec,
} from "./constants"
import { analizaJednoczesnosci, type OdbiornikDoAnalizy } from "./jednoczesnosc"
import { obliczKosztorys, obliczKosztKonwersji24Do48, type KosztorysWynik } from "./kosztorys"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"
import {
  calculateDopasowanieTablicyFalownika,
  type DopasowanieTablicyFalownikaResult,
} from "@/lib/core/modules/pv/dopasowanie-tablicy-falownika/calculator"
import { przewymiarowanieZaMale, przewymiarowanieZaDuze, przewymiarowanieOk } from "@/lib/core/modules/pv/dopasowanie-tablicy-falownika/warnings"
import { DC_AC_RATIO_ZALECANE_MIN, DC_AC_RATIO_ZALECANE_MAX } from "@/lib/core/modules/pv/dopasowanie-tablicy-falownika/constants"

export const CALCULATOR_VERSION = "2.0.0"

export type KabelPorownanie = {
  przekrojMm2: number
  obciazalnoscEfektywnaA: number
  spadekNapieciaPct: number
  strataRocznaKwh: number
  status: Status
  warnings: Warning[]
}

export type PvWynik = {
  falownik: FalownikVevorSpec
  liczbaPaneliWStringu: number
  liczbaStringowRownoleglych: number
  mocPvCalkowitaWpW: number
  dcAcRatioCalkowity: number
  echo: CalcResult<DopasowanieTablicyFalownikaResult> | null
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
  pv: PvWynik | null
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
    pv: null,
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

function obliczPv(input: NapiecieSystemoweInput): PvWynik | null {
  if (input.falownikVevor === null) return null
  const falownik = FALOWNIKI_VEVOR.find((f) => f.id === input.falownikVevor)
  if (!falownik) return null

  const liczbaPaneliWStringu = input.liczbaPaneliWStringu > 0 ? input.liczbaPaneliWStringu : falownik.liczbaPaneliWSzereguRekomendowana
  const liczbaStringowRownoleglych = falownik.liczbaStringowRownoleglychRekomendowana
  const mocPvJednegoStringuWpW = PANEL_JA_SOLAR_500W.mocWp * liczbaPaneliWStringu
  const mocPvCalkowitaWpW = mocPvJednegoStringuWpW * liczbaStringowRownoleglych

  if (!falownik.maMppt) {
    // Model bez wbudowanego MPPT (12V) — brak formuły do sprawdzenia w źródle poza wymogiem
    // zewnętrznego regulatora (100-150V, 40-60A); tylko informacyjnie, bez twardego wyniku.
    return {
      falownik,
      liczbaPaneliWStringu,
      liczbaStringowRownoleglych,
      mocPvCalkowitaWpW,
      dcAcRatioCalkowity: mocPvCalkowitaWpW / falownik.mocCiaglaW,
      echo: null,
      status: "VALID",
      warnings: [],
    }
  }

  const echo = calculateDopasowanieTablicyFalownika({
    vocStcV: PANEL_JA_SOLAR_500W.vocStcV,
    vmpStcV: PANEL_JA_SOLAR_500W.vmpStcV,
    impA: PANEL_JA_SOLAR_500W.impA,
    betaPctNaC: PANEL_JA_SOLAR_500W.betaPctNaC,
    tminC: input.tminC,
    liczbaPaneliWStringu,
    vMaxFalownikaV: falownik.vMaxFalownikaV ?? 0,
    mpptMinV: falownik.mpptMinV ?? 0,
    mpptMaxV: falownik.mpptMaxV ?? 0,
    iMaxMpptA: falownik.iMaxMpptA ?? 0,
    mocFalownikaAcW: falownik.mocCiaglaW,
  })

  if (!isComputed(echo.status)) {
    return {
      falownik,
      liczbaPaneliWStringu,
      liczbaStringowRownoleglych,
      mocPvCalkowitaWpW,
      dcAcRatioCalkowity: 0,
      echo,
      status: echo.status,
      warnings: echo.warnings,
    }
  }

  // Kalkulator echowany sprawdza JEDEN string — jego własne ostrzeżenie DC/AC porównuje moc
  // jednego stringu z mocą całego falownika, co jest mylące przy kilku stringach równoległych
  // (Model 3: 2 panele/string × 4 stringi). Odfiltrowane i policzone od nowa z mocą CAŁKOWITĄ.
  const dcAcRatioCalkowity = mocPvCalkowitaWpW / falownik.mocCiaglaW
  const warningsBezDcAc = echo.warnings.filter((w) => !w.code.startsWith("DC-AC"))
  const dcAcWarning =
    dcAcRatioCalkowity < DC_AC_RATIO_ZALECANE_MIN
      ? przewymiarowanieZaMale(dcAcRatioCalkowity, DC_AC_RATIO_ZALECANE_MIN)
      : dcAcRatioCalkowity > DC_AC_RATIO_ZALECANE_MAX
        ? przewymiarowanieZaDuze(dcAcRatioCalkowity, DC_AC_RATIO_ZALECANE_MAX)
        : przewymiarowanieOk(dcAcRatioCalkowity)

  const warnings = [...warningsBezDcAc, dcAcWarning]
  const maNieinformacyjne = warnings.some((w) => w.level !== "info")

  return {
    falownik,
    liczbaPaneliWStringu,
    liczbaStringowRownoleglych,
    mocPvCalkowitaWpW,
    dcAcRatioCalkowity,
    echo,
    status: maNieinformacyjne ? "VALID_WITH_WARNINGS" : "VALID",
    warnings,
  }
}

/**
 * Ekran 2, Moduł 4 "Magazyn energii / baterie" — "Doradca doboru napięcia systemowego". Wersja
 * 2.0.0: rdzeń I=P/V (Etap "historyczny", wzór i progi niezmienione od 1.0.0) rozbudowany o
 * materiał źródłowy "Dobór napięcia systemu Off-Grid v3.0" (docs/zrodla/Material_Nowy_Modul_...),
 * poprawiony w 4 rundach zamkniętych 13.09.2026 (docs/memory.md). Zasada nadrzędna zastosowana
 * wszędzie: gdziekolwiek aplikacja ma już precyzyjniejszy kalkulator niż uproszczenie źródła —
 * echo tego kalkulatora wygrywa (Etap C→M5/E1 dobor-przekroju-kabla, Etap G→M3/E14
 * dopasowanie-tablicy-falownika), zamiast duplikowania nienormatywnych wzorów źródła.
 *
 * Etap D (rekomendacja oświetlenia/gniazd DC) i Etap F (łączenie równoległe pakietów) świadomie
 * BEZ własnej logiki liczącej w tym kalkulatorze — Etap D to czysto informacyjne porównanie
 * (tabela w UI, żadnego nowego wzoru), Etap F odsyła do już zbudowanego, fizycznie poprawnego
 * `szyny-zbiorcze-miedzypakietowe` (M4/Ekran 25, rozkład prądu w gałęziach równoległych) zamiast
 * duplikować tę samą fizykę drugi raz w tym module.
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
    liczbaPaneliWStringu: input.liczbaPaneliWStringu,
    tminC: input.tminC ?? 0,
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

  // Etap G — echo dopasowanie-tablicy-falownika.
  const pv = obliczPv(input)
  if (pv && pv.warnings.some((w) => w.level !== "info")) {
    warnings.push(...pv.warnings.filter((w) => w.level !== "info"))
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
      pv,
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
      "Etap F (łączenie pakietów równoległych) NIE liczony tu ponownie — odsyła do już zbudowanego M4/Ekran25 (szyny-zbiorcze-miedzypakietowe), które liczy realny rozkład prądu w gałęziach.",
      "Etap G: dane panelu JA Solar JAM60D41-500/LB z karty katalogowej (Voc/Vmp/Imp/β realne, nie przybliżenie '~50V' z materiału). Model 12V (bez MPPT) tylko informacyjny — źródło nie podaje konkretnego regulatora do sprawdzenia. DC/AC total przeliczone własnym wzorem (moc WSZYSTKICH stringów), bo echowany kalkulator sprawdza tylko jeden string.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
