import type { Warning } from "@/lib/core/calc-result"

/** Zmigrowane do i18n (docs/standards/17-i18n.md) — bez `message`, patrz `lib/i18n/dictionary-*.ts`. */

export function punktGpsPozaZakresem(zbior: string, indeks: number): Warning {
  return {
    code: "SKANER-PUNKT-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SKANER-PUNKT-POZA-ZAKRESEM",
    params: { zbior, indeks: indeks + 1 },
    technicalMessage: `${zbior}[${indeks}]: szerokość poza [-90, 90] albo długość poza [-180, 180]`,
    field: zbior,
  }
}

export function zaMaloPunktow(zbior: string, min: number): Warning {
  return {
    code: "SKANER-ZA-MALO-PUNKTOW",
    level: "critical",
    i18nKey: "SKANER-ZA-MALO-PUNKTOW",
    params: { zbior, min },
    technicalMessage: `${zbior}: mniej niż ${min} punkty`,
    field: zbior,
  }
}

export function polacBezWysokosci(nazwa: string): Warning {
  return {
    code: "SKANER-POLAC-BEZ-WYSOKOSCI",
    level: "critical",
    i18nKey: "SKANER-POLAC-BEZ-WYSOKOSCI",
    params: { nazwa },
    technicalMessage: `połać "${nazwa}": co najmniej jeden punkt bez wysokoscM`,
    field: "polacie",
  }
}

export function kalibracjaNiepoprawna(powod: string): Warning {
  return {
    code: "SKANER-KALIBRACJA-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "SKANER-KALIBRACJA-NIEPOPRAWNA",
    technicalMessage: `kalibracja: ${powod}`,
    field: "kalibracja",
  }
}

export function przeszkodaNiepoprawna(nazwa: string): Warning {
  return {
    code: "SKANER-PRZESZKODA-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "SKANER-PRZESZKODA-NIEPOPRAWNA",
    params: { nazwa },
    technicalMessage: `przeszkoda "${nazwa}": wysokoscM < 0 albo promienM <= 0`,
    field: "przeszkody",
  }
}

export function przeszkodaObrysNiepoprawna(nazwa: string): Warning {
  return {
    code: "SKANER-PRZESZKODA-OBRYS-NIEPOPRAWNA",
    level: "critical",
    i18nKey: "SKANER-PRZESZKODA-OBRYS-NIEPOPRAWNA",
    params: { nazwa },
    technicalMessage: `przeszkoda-obrys "${nazwa}": wysokoscM < 0 albo nie jest liczbą`,
    field: "przeszkody",
  }
}

export function brakWysokosciGruntu(): Warning {
  return {
    code: "SKANER-BRAK-WYSOKOSCI-GRUNTU",
    level: "info",
    i18nKey: "SKANER-BRAK-WYSOKOSCI-GRUNTU",
    technicalMessage: "punktyBudynku bez wysokoscM — wysokość kalenicy nie może być wyznaczona",
    field: "punktyBudynku",
  }
}
