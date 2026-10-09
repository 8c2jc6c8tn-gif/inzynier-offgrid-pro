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

/** Owner decision 09.10.2026: a panel lacking γ or NOCT is left out of the comparison (greyed in the UI), the others keep the temperature model. */
export function panelWykluczonyPorp(opisy: string): Warning {
  return ostrzezenie("PORP-PANEL-WYKLUCZONY", "warning", `panele wykluczone z porównania (brak danych): ${opisy}`, { opisy }, "panele")
}

/** A1 takes the front side only for bifacial panels. */
export function bifacjalnyPominietyPorp(nazwa: string): Warning {
  return ostrzezenie("PORP-BIFACJALNY-POMINIETY", "info", `panel „${nazwa}” bifacjalny — tylko strona przednia`, { nazwa })
}

/** The weights do not sum to anything: no criterion could be scored. */
export function brakKryteriowPorp(): Warning {
  return ostrzezenie("PORP-BRAK-KRYTERIOW", "info", "żadne zaznaczone kryterium nie ma danych wszystkich paneli — gwiazdki pominięte")
}

/** A2: number of panels is to come from the place's dimensions, but the datasheet of this panel gives no size. */
export function brakWymiarowPaneluPorp(nazwa: string): Warning {
  return ostrzezenie("PORP-BRAK-WYMIAROW-PANELU", "warning", `panel „${nazwa}” bez wymiarów — nie da się policzyć, ile się zmieści`, { nazwa }, "dlugoscMm")
}

/** A2: the design window of a tilted mount has no sun above the horizon on 21 Dec — the row spacing cannot be derived. */
export function oknoOdstepuBezSloncaPorp(odH: number, doH: number): Warning {
  return ostrzezenie("PORP-ODSTEP-OKNO-BEZ-SLONCA", "warning", `okno ${odH}–${doH} (czas słoneczny, 21 grudnia): słońce pod horyzontem — odstęp rzędów niewyznaczalny`, { odH, doH }, "wymiaryMiejsca")
}

/** A2: with the given margins not a single panel of this model fits. */
export function panelSieNieMiesciPorp(nazwa: string): Warning {
  return ostrzezenie("PORP-PANEL-SIE-NIE-MIESCI", "warning", `panel „${nazwa}” nie mieści się w podanym miejscu`, { nazwa }, "wymiaryMiejsca")
}

/** A2: the typed number of panels is larger than what fits in the typed dimensions. */
export function liczbaPrzekraczaMiejscePorp(nazwa: string, wpisano: number, miesci: number): Warning {
  return ostrzezenie("PORP-LICZBA-PRZEKRACZA-MIEJSCE", "warning", `„${nazwa}”: wpisano ${wpisano} szt., w podanych wymiarach mieści się ${miesci}`, { nazwa, wpisano, miesci }, "liczbaPaneli")
}

/** A3: a panel has electrical data on the card, but the lowest temperature was not given — the string voltage in winter cannot be computed. */
export function elektrykaBrakTminPorp(): Warning {
  return ostrzezenie("PORP-ELEKTRYKA-BRAK-TMIN", "info", "brak najniższej temperatury miejsca — napięcie stringów zimą nie zostało policzone", undefined, "tminC")
}

/** A3: the catalogue entry or the typed panel has no electrical data (Voc, Vmp, Isc, Imp, β) — strings are not assessed for it. */
export function elektrykaBrakDanychPorp(nazwa: string): Warning {
  return ostrzezenie("PORP-ELEKTRYKA-BRAK-DANYCH", "info", `panel „${nazwa}” bez danych elektrycznych — stringi nieocenione`, { nazwa }, "elektryka")
}
