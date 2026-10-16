import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

export function wartoscNiedodatniaTo(pole: string, wartosc: number): Warning {
  return ostrzezenie("TOGR-WARTOSC-NIEDODATNIA", "critical", `${pole} = ${wartosc}, oczekiwano liczby > 0`, undefined, pole)
}

export function godzinyPozaZakresemTo(wartosc: number): Warning {
  return ostrzezenie("TOGR-GODZINY-POZA-ZAKRESEM", "critical", `godzinNocy = ${wartosc}, oczekiwano 0 < h <= 24`, { godzin: wartosc }, "godzinNocy")
}

export function zuzycieUjemneTo(nazwa: string): Warning {
  return ostrzezenie("TOGR-ZUZYCIE-UJEMNE", "critical", `odbiornik „${nazwa}”: dobowe zużycie musi być >= 0`, { nazwa }, "odbiorniki")
}

/** Nothing stays on: a legitimate choice, but worth a reminder — the app does not judge what is safety-critical. */
export function nicNieZostajeTo(): Warning {
  return ostrzezenie("TOGR-NIC-NIE-ZOSTAJE", "info", "żaden odbiornik nie zostaje włączony — sprawdź, czy nie ma wśród nich takich, które muszą pracować (np. lodówka, zabezpieczenia)")
}

/** The list has no consumption at all (nothing entered in the Module 12 list). */
export function pustaListaTo(): Warning {
  return ostrzezenie("TOGR-PUSTA-LISTA", "info", "lista odbiorników jest pusta albo bez zużycia — uzupełnij ją na ekranie „Zużycie energii per urządzenie”")
}
