/**
 * m06f-materialy-przegrod — screen text of the material library and partition templates in M6/E1 "Straty ciepła budynku"
 * (spec 37.7). Names of materials/templates; λ statuses are carried over from inzynier-szkieletowy-pro, not invented.
 */
// English: ./m06f-materialy-przegrod.en.ts, Russian: ./m06f-materialy-przegrod.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-MAT-WELNA-035": "Wełna mineralna λ0,035",
  "UI-MAT-WELNA-038": "Wełna mineralna λ0,038",
  "UI-MAT-WELNA-040": "Wełna mineralna λ0,040",
  "UI-MAT-KNAUF-UNIFIT-032": "Wełna Knauf Unifit 032 (λ0,032)",
  "UI-MAT-KNAUF-UNIFIT-033": "Wełna Knauf Unifit 033 (λ0,033)",
  "UI-MAT-KNAUF-UNIFIT-035": "Wełna Knauf Unifit 035 (λ0,035)",
  "UI-MAT-KNAUF-UNIFIT-037": "Wełna Knauf Unifit 037 (λ0,037)",
  "UI-MAT-EPS-038": "Styropian EPS (λ0,038)",
  "UI-MAT-PIR-023": "Płyta PIR (λ0,023)",
  "UI-MAT-OSB-3": "Płyta OSB-3",
  "UI-MAT-PLYTA-GK": "Płyta gipsowo-kartonowa",
  "UI-MAT-DESKA-ELEWACYJNA": "Deska elewacyjna drewniana",
  "UI-MAT-TYNK-CIENKOWARSTWOWY": "Tynk cienkowarstwowy",
  "UI-MAT-PANEL-PODLOGOWY": "Panel podłogowy laminowany",
  "UI-MAT-BLACHODACHOWKA": "Blachodachówka",
  "UI-MAT-DACHOWKA-CERAMICZNA": "Dachówka ceramiczna",
  "UI-MAT-GONT-BITUMICZNY": "Gont bitumiczny",
  "UI-MAT-BLACHA-NA-RABEK": "Blacha na rąbek stojący",
  "UI-MAT-PAPA-SBS": "Papa termozgrzewalna SBS",
  "UI-MAT-MEMBRANA-EPDM": "Membrana EPDM",
  "UI-SZABLON-SCIANA-SZKIELETOWA": "Ściana szkieletowa: OSB + wełna 145 mm + płyta GK",
  "UI-SZABLON-DACH-KROKWIE": "Dach między krokwiami: OSB + wełna 145 mm",
  "UI-SZABLON-PODLOGA-LEGARY": "Podłoga na legarach: OSB + wełna 195 mm + OSB 24 mm",
  "UI-OBCCIE-SZABLON": "Gotowa przegroda (szablon warstw)",
  "UI-OBCCIE-SZABLON-WYBIERZ": "— wybierz szablon, by wypełnić warstwy —",
  "UI-OBCCIE-MATERIAL": "Materiał z biblioteki",
  "UI-OBCCIE-MATERIAL-WLASNY": "— własny (wpisz λ ręcznie) —",
  "UI-OBCCIE-LAMBDA-STATUS-KARTA": "λ z karty producenta (Knauf Unifit, wg Inżyniera Szkieletowego Pro) — sprawdź, czy to Twój produkt.",
  "UI-OBCCIE-LAMBDA-STATUS-NORMA": "λ z normy ISO 10456:2007, Tablica 3 (wg Inżyniera Szkieletowego Pro).",
  "UI-OBCCIE-LAMBDA-STATUS-ORIENTACYJNE": "λ orientacyjna, do weryfikacji z kartą produktu — wartość przejęta z Inżyniera Szkieletowego Pro, nie jest pewnikiem. Wpisz własną λ, jeśli masz kartę.",
} as const
