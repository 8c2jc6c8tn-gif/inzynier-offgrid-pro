import type { Warning } from "@/lib/core/calc-result"

/** Pionowy: trawa/zaspa sięga ponad dolną krawędź paneli — geometria, nie próg "30 cm" ze źródła. */
export function zaspaZacieniaDolneOgniwa(przeszkodaCm: number, krawedzCm: number): Warning {
  return {
    code: "TM-ZASPA-ZACIENIA-DOLNE-OGNIWA",
    level: "warning",
    i18nKey: "TM-ZASPA-ZACIENIA-DOLNE-OGNIWA",
    params: { przeszkodaCm, krawedzCm },
    technicalMessage: `trawa/zaspa ${przeszkodaCm} cm > dolna krawędź paneli ${krawedzCm} cm — dolny rząd ogniw w cieniu`,
    field: "wysokoscTrawySnieguCm",
  }
}

/** Dach płaski / grunt: źródło — "Ryzyko zalegania śniegu rośnie przy kątach <30°". */
export function sniegZalegaPonizejProgu(kat: number, prog: number): Warning {
  return {
    code: "TM-SNIEG-ZALEGA",
    level: "info",
    i18nKey: "TM-SNIEG-ZALEGA",
    params: { kat, prog },
    technicalMessage: `nachylenieDeg = ${kat} < ${prog}: rośnie ryzyko zalegania śniegu (źródło, Ekran 2)`,
    field: "nachylenieDeg",
  }
}

/** Źródło: 🔴 "Siła ssania od spodu może zerwać panele — skonsultuj z konstruktorem" (~45°). */
export function ssanieOdSpodu(kat: number, prog: number): Warning {
  return {
    code: "TM-SSANIE-OD-SPODU",
    level: "critical",
    i18nKey: "TM-SSANIE-OD-SPODU",
    params: { kat, prog },
    technicalMessage: `nachylenie ${kat}° >= ${prog}° — ssanie od spodu może zerwać panele (źródło, Ekran 2)`,
    field: "nachylenieDeg",
  }
}

/** Stelaż na dachu płaskim liczony jak wiata wolnostojąca — strefy krawędziowe i nośność dachu poza ekranem. */
export function dachPozaModelemWiaty(): Warning {
  return {
    code: "TM-DACH-POZA-MODELEM-WIATY",
    level: "warning",
    i18nKey: "TM-DACH-POZA-MODELEM-WIATY",
    technicalMessage: "Tablica 7.6 dotyczy wiat wolnostojących — opływ nad dachem budynku i nośność dachu pod balast nieliczone",
    field: "miejsce",
  }
}

/** Wiata: kąt poniżej dolnej granicy zakresu samooczyszczania. */
export function wiataKatPonizejSamooczyszczania(kat: number, min: number, max: number): Warning {
  return {
    code: "TM-WIATA-KAT-PONIZEJ-SAMOOCZYSZCZANIA",
    level: "warning",
    i18nKey: "TM-WIATA-KAT-PONIZEJ-SAMOOCZYSZCZANIA",
    params: { kat, min, max },
    technicalMessage: `nachylenieDeg = ${kat} < ${min} (źródło: min. ${min}-${max}° dla samooczyszczania)`,
    field: "nachylenieDeg",
  }
}

/** Wiata: kąt wewnątrz zakresu 5–10° — źródło nie mówi, który koniec zakresu wystarcza. */
export function wiataKatWZakresie(kat: number, min: number, max: number): Warning {
  return {
    code: "TM-WIATA-KAT-W-ZAKRESIE",
    level: "info",
    i18nKey: "TM-WIATA-KAT-W-ZAKRESIE",
    params: { kat, min, max },
    technicalMessage: `nachylenieDeg = ${kat} w zakresie ${min}-${max}° — granica samooczyszczania niepewna`,
    field: "nachylenieDeg",
  }
}

export function wiataPanelSieNieMiesci(): Warning {
  return {
    code: "TM-WIATA-ZERO-PANELI",
    level: "warning",
    i18nKey: "TM-WIATA-ZERO-PANELI",
    technicalMessage: "panel większy od połaci w obu orientacjach — 0 paneli",
  }
}

/** Powierzchnie: zaznaczona powierzchnia nie istnieje w wyniku M1/E4 (np. usunięta po ocenie). */
export function powierzchniaNieznana(nazwa: string): Warning {
  return {
    code: "TM-POWIERZCHNIA-NIEZNANA",
    level: "critical",
    i18nKey: "TM-POWIERZCHNIA-NIEZNANA",
    params: { nazwa },
    technicalMessage: `powierzchnia "${nazwa}" nie występuje w ocenie M1/E4`,
    field: "wybrane",
  }
}

export function zakresRegulacjiOdwrocony(min: number, max: number): Warning {
  return {
    code: "TM-ZAKRES-REGULACJI-ODWROCONY",
    level: "critical",
    i18nKey: "TM-ZAKRES-REGULACJI-ODWROCONY",
    params: { min, max },
    technicalMessage: `katMinDeg = ${min} > katMaxDeg = ${max}`,
    field: "katMinDeg",
  }
}
