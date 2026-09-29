import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { MIEJSCA_WILGOTNE_UZIEMIENIE } from "./constants"
import type { OdpowiedzKontrolna, UziemienieMaleInstalacjeInput } from "./input"
import {
  brakPolaczeniaNPE,
  brakRcd30mA,
  dcBezUziemieniaOchronnego,
  gniazdaBezStykuOchronnego,
  obudowaFalownikaNieuziemiona,
  wilgocZalecaneUziemienie,
} from "./warnings"

export const CALCULATOR_VERSION = "1.2.0"

const FORMULA =
  "230\\,V_{AC} \\Rightarrow PE_{obudowa\\ falownika} \\wedge PE_{gniazda\\ 230\\,V} \\wedge (N\\text{–}PE)_{falownik} \\wedge RCD_{30\\,mA};\\ 12/24\\,V_{DC} \\Rightarrow PE \\text{ zwykle niewymagane}"

export type UziemienieMaleInstalacjeResult = {
  /** Czy wymagane jest uziemienie ochronne; `null` = nie policzono (brak danych). */
  wymaganeUziemienieOchronne: boolean | null
  /** Czy źródło zaleca uziemienie ze względu na wilgotne miejsce (jacht, na zewnątrz). */
  zalecaneZeWzgleduNaWilgoc: boolean
}

const PUSTY_WYNIK: UziemienieMaleInstalacjeResult = { wymaganeUziemienieOchronne: null, zalecaneZeWzgleduNaWilgoc: false }

const KOD_ODPOWIEDZI: Record<OdpowiedzKontrolna, number> = { tak: 1, nie: 0, "nie-wiem": -2 }

/**
 * Ekran 38, Moduł 12 — "Uziemienie małej instalacji" (dawne 8.65, Biblia §12.53). Logika 1:1 ze źródła: 12/24 V DC
 * zwykle bez uziemienia ochronnego; 230 V z falownika — wymagana uziemiona obudowa falownika i gniazda ze stykiem
 * ochronnym; w miejscach wilgotnych (jacht, na zewnątrz) źródło zaleca uziemienie. Twardy stop obudowy — poziom z M5/E11;
 * gniazda bez styku ochronnego i zalecenie przy wilgoci — 🟡 (D52). Pętla zwarcia (D54): ochrona na falowniku nie
 * potrzebuje ziemi, tylko połączenia N–PE w falowniku (jeśli producent pozwala) i RCD 30 mA za nim — brak = 🔴.
 * "Nie wiem" = strona bezpieczna (jak "nie"). Bez liczb i norm spoza źródła; uziom prętowy (rezystancja) — M5/E9.
 */
export function calculateUziemienieMaleInstalacje(
  input: UziemienieMaleInstalacjeInput,
): CalcResult<UziemienieMaleInstalacjeResult> {
  const inputs = {
    ac230: input.rodzaj === null ? -1 : input.rodzaj === "ac230" ? 1 : 0,
    ...(input.obudowaFalownikaUziemiona !== null && { obudowaFalownikaUziemiona: KOD_ODPOWIEDZI[input.obudowaFalownikaUziemiona] }),
    ...(input.gniazdaZeStykiemOchronnym !== null && { gniazdaZeStykiemOchronnym: KOD_ODPOWIEDZI[input.gniazdaZeStykiemOchronnym] }),
    ...(input.polaczenieNPE !== null && { polaczenieNPE: KOD_ODPOWIEDZI[input.polaczenieNPE] }),
    ...(input.rcd30mA !== null && { rcd30mA: KOD_ODPOWIEDZI[input.rcd30mA] }),
  }
  const wynik = (
    status: CalcResult<UziemienieMaleInstalacjeResult>["status"],
    value: UziemienieMaleInstalacjeResult,
    warnings: Warning[] = [],
    assumptions: Assumption[] = [],
  ): CalcResult<UziemienieMaleInstalacjeResult> => ({
    value,
    unit: "",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const { rodzaj, miejsce, obudowaFalownikaUziemiona: obudowa, gniazdaZeStykiemOchronnym: gniazda, polaczenieNPE, rcd30mA } = input
  if (rodzaj === null || miejsce === null) return wynik("INCOMPLETE", PUSTY_WYNIK)

  const zalecaneZeWzgleduNaWilgoc = MIEJSCA_WILGOTNE_UZIEMIENIE.includes(miejsce)
  const warnings: Warning[] = []
  const assumptions: Assumption[] = [{ kod: "UMI-ZALOZENIE-BEZ-UZIOMU-BUDYNKOWEGO" }]

  if (rodzaj === "dc") {
    warnings.push(dcBezUziemieniaOchronnego())
    // Damp place: the source recommends earthing. With 230 V earthing is already required and checked by the questions below,
    // so the recommendation would only duplicate them (or be a false alarm when everything is connected).
    if (zalecaneZeWzgleduNaWilgoc) warnings.push(wilgocZalecaneUziemienie(miejsce))
  } else {
    // The control questions only apply to 230 V — without all answers the check is not done (3.3, INCOMPLETE).
    if (obudowa === null || gniazda === null || polaczenieNPE === null || rcd30mA === null) return wynik("INCOMPLETE", PUSTY_WYNIK)
    assumptions.push({ kod: "UMI-ZALOZENIE-NIE-WIEM-JAK-NIE" })
    if (obudowa !== "tak") warnings.push(obudowaFalownikaNieuziemiona(obudowa))
    if (gniazda !== "tak") warnings.push(gniazdaBezStykuOchronnego(gniazda))
    // Fault loop (D54): protection needs the loop PE → N–PE bond → inverter, and an RCD 30 mA behind the bond — not earth.
    if (polaczenieNPE !== "tak") warnings.push(brakPolaczeniaNPE(polaczenieNPE))
    if (rcd30mA !== "tak") warnings.push(brakRcd30mA(rcd30mA))
  }

  return wynik(
    warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    { wymaganeUziemienieOchronne: rodzaj === "ac230", zalecaneZeWzgleduNaWilgoc },
    warnings,
    assumptions,
  )
}
