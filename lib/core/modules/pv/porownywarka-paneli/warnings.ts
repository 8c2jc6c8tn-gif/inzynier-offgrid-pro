import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

/** Form validation: a negative or non-finite number. */
export function wartoscUjemnaPorp(pole: string, wartosc: number): Warning {
  return ostrzezenie("PORP-WARTOSC-UJEMNA", "critical", `${pole} = ${wartosc}, oczekiwano liczby skończonej >= 0`, undefined, pole)
}

export function porpPozaZakresem(code: string, pole: string, wartosc: number, zakres: string): Warning {
  return ostrzezenie(code, "critical", `${pole} = ${wartosc} poza zakresem ${zakres}`, { zakres }, pole)
}

/** U20: no more than 4 panels at once. */
export function zaDuzoPanelowPorp(liczba: number, maks: number): Warning {
  return ostrzezenie("PORP-ZA-DUZO-PANELI", "critical", `${liczba} paneli, maksimum ${maks} (U20)`, { liczba, maks }, "panele")
}

/** U6: price is required for the “zł” part; the yield part is still computed. */
export function brakCenyPorp(nazwa: string): Warning {
  return ostrzezenie("PORP-BRAK-CENY", "warning", `panel „${nazwa}” bez ceny — część „zł” pominięta`, { nazwa }, "cenaBruttoZl")
}

/** The hourly temperature is missing in the saved TMY — temperature-corrected yield impossible. */
export function brakTemperaturyGodzinowejPorp(): Warning {
  return ostrzezenie("PORP-BRAK-TEMPERATURY-GODZINOWEJ", "info", "rekordy TMY bez tempC — pobierz dane ponownie")
}

/** Some panel lacks γ or NOCT — the yield of the whole set is simplified (STC × G_poa). */
export function modelUproszczonyPorp(brakuje: string): Warning {
  return ostrzezenie("PORP-MODEL-UPROSZCZONY", "info", `brak parametrów temperaturowych: ${brakuje}`, { brakuje })
}

/** A1 takes the front side only for bifacial panels. */
export function bifacjalnyPominietyPorp(nazwa: string): Warning {
  return ostrzezenie("PORP-BIFACJALNY-POMINIETY", "info", `panel „${nazwa}” bifacjalny — tylko strona przednia`, { nazwa })
}

/** The weights do not sum to anything: no criterion could be scored. */
export function brakKryteriowPorp(): Warning {
  return ostrzezenie("PORP-BRAK-KRYTERIOW", "info", "żadne zaznaczone kryterium nie ma danych wszystkich paneli — gwiazdki pominięte")
}
