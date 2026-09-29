import type { Warning } from "@/lib/core/calc-result"
import { obudowaNiepolaczonaZGsw } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/warnings"
import { progPowyzejOchronyOsob } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/warnings"
import type { OdpowiedzKontrolna } from "./input"

/**
 * Nieuziemiona obudowa falownika 230 V (Biblia §12.53: "Falownik 230V musi mieć uziemioną obudowę"). Poziom — echo
 * M5/E11 (`OBUDOWA-NIEPOLACZONA-Z-GSW`, twardy stop); własny kod, bo w kamperze/na jachcie nie ma GSW budynku.
 */
export function obudowaFalownikaNieuziemiona(odpowiedz: OdpowiedzKontrolna): Warning {
  return {
    code: "UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA",
    level: obudowaNiepolaczonaZGsw().level,
    i18nKey: "UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA",
    technicalMessage: `rodzaj = ac230, obudowaFalownikaUziemiona = ${odpowiedz} (poziom z M5/E11 OBUDOWA-NIEPOLACZONA-Z-GSW)`,
    field: "obudowaFalownikaUziemiona",
  }
}

/**
 * Gniazda 230 V bez styku ochronnego (Biblia §12.53: "Sprawdza, czy … gniazda 230V mają styk ochronny"; ostrzeżenie
 * źródła: "Brak uziemienia przy zwarciach to ryzyko porażenia"). Poziom 🟡 — D52 (decyzja właściciela 29.09.2026:
 * „żółty, ale napisać, czym grozi brak bolca i po co on jest”); komunikat wyjaśnia rolę styku ochronnego.
 */
export function gniazdaBezStykuOchronnego(odpowiedz: OdpowiedzKontrolna): Warning {
  return {
    code: "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO",
    level: "warning",
    i18nKey: "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO",
    technicalMessage: `rodzaj = ac230, gniazdaZeStykiemOchronnym = ${odpowiedz} (źródło: ryzyko porażenia)`,
    field: "gniazdaZeStykiemOchronnym",
  }
}

/**
 * Brak połączenia N–PE w falowniku (D54, decyzja właściciela 29.09.2026). Ochrona w wyspie z falownika nie potrzebuje
 * ziemi, tylko zamkniętej pętli zwarcia: obudowa → PE → punkt N–PE w falowniku → falownik. Bez tego punktu zwarcie na
 * obudowę nie daje dużego prądu, więc ani bezpiecznik, ani RCD nie wyłączą obwodu — twardy stop.
 */
export function brakPolaczeniaNPE(odpowiedz: OdpowiedzKontrolna): Warning {
  return {
    code: "UMI-BRAK-POLACZENIA-N-PE",
    level: "critical",
    i18nKey: "UMI-BRAK-POLACZENIA-N-PE",
    technicalMessage: `rodzaj = ac230, polaczenieNPE = ${odpowiedz} — pętla zwarcia otwarta, zabezpieczenie nie zadziała (D54)`,
    field: "polaczenieNPE",
  }
}

/**
 * Brak RCD 30 mA za połączeniem N–PE (D54). Poziom — echo M5 `PROG-POWYZEJ-OCHRONY-OSOB` (wylaczniki-rcd: ochrona
 * osób wymaga 30 mA, twardy stop); własny kod, bo tu pytanie brzmi „czy RCD 30 mA w ogóle jest”.
 */
export function brakRcd30mA(odpowiedz: OdpowiedzKontrolna): Warning {
  return {
    code: "UMI-BRAK-RCD-30MA",
    level: progPowyzejOchronyOsob(30).level,
    i18nKey: "UMI-BRAK-RCD-30MA",
    technicalMessage: `rodzaj = ac230, rcd30mA = ${odpowiedz} (poziom z M5 PROG-POWYZEJ-OCHRONY-OSOB)`,
    field: "rcd30mA",
  }
}

/** Instalacja wyłącznie 12/24 V DC (Biblia §12.53: "zwykle nie wymagają uziemienia ochronnego"). */
export function dcBezUziemieniaOchronnego(): Warning {
  return {
    code: "UMI-DC-BEZ-UZIEMIENIA-OCHRONNEGO",
    level: "info",
    i18nKey: "UMI-DC-BEZ-UZIEMIENIA-OCHRONNEGO",
    technicalMessage: "rodzaj = dc — uziemienie ochronne zwykle niewymagane (źródło)",
  }
}

/** Miejsce wilgotne (jacht, na zewnątrz) — źródło zaleca uziemienie; 🟡 jak zalecenia IP w E23 (D52), nie twardy stop. */
export function wilgocZalecaneUziemienie(miejsce: string): Warning {
  return {
    code: "UMI-WILGOC-ZALECANE-UZIEMIENIE",
    level: "warning",
    i18nKey: "UMI-WILGOC-ZALECANE-UZIEMIENIE",
    technicalMessage: `miejsce = ${miejsce} ∈ {jacht, zewnatrz} (źródło: zaleca uziemienie w miejscach wilgotnych)`,
  }
}
