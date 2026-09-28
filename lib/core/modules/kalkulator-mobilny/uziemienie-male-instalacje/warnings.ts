import type { Warning } from "@/lib/core/calc-result"
import { obudowaNiepolaczonaZGsw } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/warnings"
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
 * źródła: "Brak uziemienia przy zwarciach to ryzyko porażenia"). Poziom 🔴 — ryzyko porażenia (4.1), ten sam co obudowa.
 */
export function gniazdaBezStykuOchronnego(odpowiedz: OdpowiedzKontrolna): Warning {
  return {
    code: "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO",
    level: "critical",
    i18nKey: "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO",
    technicalMessage: `rodzaj = ac230, gniazdaZeStykiemOchronnym = ${odpowiedz} (źródło: ryzyko porażenia)`,
    field: "gniazdaZeStykiemOchronnym",
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

/** Miejsce wilgotne (jacht, na zewnątrz) — źródło zaleca uziemienie; zalecenie, nie próg. */
export function wilgocZalecaneUziemienie(miejsce: string): Warning {
  return {
    code: "UMI-WILGOC-ZALECANE-UZIEMIENIE",
    level: "info",
    i18nKey: "UMI-WILGOC-ZALECANE-UZIEMIENIE",
    technicalMessage: `miejsce = ${miejsce} ∈ {jacht, zewnatrz} (źródło: zaleca uziemienie w miejscach wilgotnych)`,
  }
}
