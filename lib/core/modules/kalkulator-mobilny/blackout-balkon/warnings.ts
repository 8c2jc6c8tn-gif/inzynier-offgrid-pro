import type { Warning } from "@/lib/core/calc-result"

/** 🟡 Biblia §12.56: "Na dłuższy blackout potrzebujesz drugiej stacji." */
export function zaMaloNaBlackout(brakWh: number, starczyH: number): Warning {
  return {
    code: "BB-ZA-MALO-NA-BLACKOUT",
    level: "warning",
    i18nKey: "BB-ZA-MALO-NA-BLACKOUT",
    params: { wh: Math.ceil(brakWh), h: Math.round(starczyH * 10) / 10 },
    technicalMessage: `brak ${brakWh} Wh na czas blackoutu`,
    field: "pojemnoscWh",
  }
}

/** 🟡 The panel is wider than the railing length available. */
export function panelSieNieMiesci(): Warning {
  return {
    code: "BB-PANEL-SIE-NIE-MIESCI",
    level: "warning",
    i18nKey: "BB-PANEL-SIE-NIE-MIESCI",
    technicalMessage: "szerokoscPaneluM > dlugoscBalustradyM",
    field: "szerokoscPaneluM",
  }
}

/** ℹ️ Biblia §12.56: "Nie licz na klimatyzację w blackoucie – tylko lodówka i światło." Always shown. */
export function bezKlimatyzacji(): Warning {
  return { code: "BB-BEZ-KLIMATYZACJI", level: "info", i18nKey: "BB-BEZ-KLIMATYZACJI", technicalMessage: "always shown (Biblia §12.56)" }
}

/** ℹ️ ✅🤖 Railing mounting: secure fixing, wind load, building manager consent. */
export function montazNaBalkonie(): Warning {
  return { code: "BB-MONTAZ-NA-BALKONIE", level: "info", i18nKey: "BB-MONTAZ-NA-BALKONIE", technicalMessage: "panel on balcony" }
}
