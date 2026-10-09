import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

/** Form validation: a value outside its allowed range. */
export function odrzPozaZakresem(code: string, pole: string, wartosc: number, zakres: string): Warning {
  return ostrzezenie(code, "critical", `${pole} = ${wartosc} poza zakresem ${zakres}`, { zakres }, pole)
}

/** Rows may not overlap physically: the pitch is smaller than the horizontal projection of one table. */
export function odstepMniejszyNizRzut(odstepM: number, rzutM: number): Warning {
  return ostrzezenie("ODRZ-ODSTEP-MNIEJSZY-NIZ-RZUT", "critical", `odstęp ${odstepM} m < rzut poziomy stołu ${rzutM} m — rzędy nachodzą na siebie`, { odstep: round(odstepM), rzut: round(rzutM) }, "odstepM")
}

/** No sample of the design window has the sun above the horizon (polar night): the window gives no rule. */
export function oknoBezSlonca(): Warning {
  return ostrzezenie("ODRZ-OKNO-BEZ-SLONCA", "warning", "w oknie projektowym słońce nie wschodzi nad horyzont — nie da się wyznaczyć odstępu", undefined, "oknoOdH")
}

/** Part of the window has the sun below the horizon — those samples are skipped. */
export function czescOknaPoZachodzie(): Warning {
  return ostrzezenie("ODRZ-CZESC-OKNA-POD-HORYZONTEM", "info", "część okna projektowego przypada na czas, gdy słońce jest pod horyzontem — te chwile pominięto")
}

/** The sun in the whole window stands behind the panels (e.g. north-facing): the front row never shades the next one. */
export function sloncePoZaPanelami(): Warning {
  return ostrzezenie("ODRZ-SLONCE-ZA-PANELAMI", "info", "w oknie projektowym słońce świeci od tyłu paneli — rząd przed nimi ich nie zacienia (odstęp = rzut poziomy)")
}

/** Tilt 0° means flat panels: no spacing needed beyond the table itself. */
export function panelePoziome(): Warning {
  return ostrzezenie("ODRZ-PANELE-POZIOME", "info", "panele poziome (0°) nie zacieniają się rzędami — odstęp wynika tylko z dojścia i obsługi")
}

/** Geometric loss only: a shaded strip at the bottom edge can cost more through bypass diodes and strings. */
export function strataGeometryczna(): Warning {
  return ostrzezenie("ODRZ-STRATA-GEOMETRYCZNA", "info", "strata liczona geometrycznie dla energii bezpośredniej; pas cienia przy dolnej krawędzi może wyłączyć całe łańcuchy ogniw (diody bocznikujące), więc rzeczywista strata bywa większa")
}

/** The target winter loss cannot be met within the physical limits (even the full window pitch leaves more). */
export function strataDocelowaNieosiagalna(docelowa: number, minimalna: number): Warning {
  return ostrzezenie("ODRZ-STRATA-DOCELOWA-NIEOSIAGALNA", "warning", `strata ${docelowa}% niedostępna: nawet przy odstępie wg okna zostaje ${minimalna}%`, { docelowa: round(docelowa), minimalna: round(minimalna) }, "docelowaStrataZimaPct")
}

function round(x: number): number {
  return Math.round(x * 100) / 100
}
