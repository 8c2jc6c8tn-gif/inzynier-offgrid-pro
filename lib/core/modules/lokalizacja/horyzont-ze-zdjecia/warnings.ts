import type { Warning } from "@/lib/core/calc-result"

function ostrzezenie(code: string, level: Warning["level"], technicalMessage: string, params?: Warning["params"], field?: string): Warning {
  return { code, level, i18nKey: code, technicalMessage, ...(params ? { params } : {}), ...(field ? { field } : {}) }
}

/** Form validation: a value outside its allowed range. */
export function horzPozaZakresem(code: string, pole: string, wartosc: number, zakres: string): Warning {
  return ostrzezenie(code, "critical", `${pole} = ${wartosc} poza zakresem ${zakres}`, { zakres }, pole)
}

/** The sun disc was clicked outside the photo. */
export function sloncePozaKadrem(): Warning {
  return ostrzezenie("HORZ-SLONCE-POZA-KADREM", "critical", "punkt słońca leży poza zdjęciem", undefined, "slonce")
}

/** At the moment of the photo the sun was below the horizon: it cannot calibrate the direction. */
export function sloncePodHoryzontem(wysokoscDeg: number): Warning {
  return ostrzezenie("HORZ-SLONCE-POD-HORYZONTEM", "critical", `wysokość słońca w chwili zdjęcia: ${wysokoscDeg.toFixed(1)}° (≤ 0°)`, { wysokosc: Math.round(wysokoscDeg * 10) / 10 }, "czasUtcMs")
}

/** The clicked point cannot be the sun at that elevation for any camera tilt: wrong click, time or place. */
export function kalibracjaNiemozliwa(): Warning {
  return ostrzezenie("HORZ-KALIBRACJA-NIEMOZLIWA", "critical", "żadne nachylenie aparatu nie daje wysokości słońca z podanego punktu zdjęcia", undefined, "slonce")
}

export function sloncaDalekoOdOsi(katDeg: number): Warning {
  return ostrzezenie("HORZ-SLONCE-DALEKO-OD-OSI", "warning", `słońce ${katDeg.toFixed(0)}° od osi obiektywu — rosną błędy zniekształceń`, { kat: Math.round(katDeg) }, "slonce")
}

export function szerokiKat(hfovDeg: number): Warning {
  return ostrzezenie("HORZ-SZEROKI-KAT", "warning", `poziomy kąt widzenia ${hfovDeg.toFixed(0)}° — obiektywy ultraszerokie zniekształcają brzegi`, { fov: Math.round(hfovDeg) }, "hfovDeg")
}

export function duzePrzechylenie(nachylenieDeg: number): Warning {
  return ostrzezenie("HORZ-DUZE-NACHYLENIE", "warning", `nachylenie aparatu ${nachylenieDeg.toFixed(0)}° — model zakłada brak przechyłu bocznego, a błąd rośnie z nachyleniem`, { nachylenie: Math.round(nachylenieDeg) }, "slonce")
}

export function przeslonietePrzyGorze(kolumny: number): Warning {
  return ostrzezenie("HORZ-ZASLONIETE-PRZY-GORZE", "warning", `${kolumny} kolumn: przeszkoda sięga górnej krawędzi kadru — prawdziwy horyzont jest wyżej`, { kolumny }, "liniaHoryzontu")
}

export function maloPokrycia(procent: number): Warning {
  return ostrzezenie("HORZ-MALE-POKRYCIE", "info", `zdjęcie obejmuje ${procent.toFixed(0)}% pełnego okręgu — resztę horyzontu uzupełnij kolejnymi zdjęciami`, { procent: Math.round(procent) }, "liniaHoryzontu")
}
